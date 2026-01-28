import { supabase } from './supabaseClient';

/**
 * Fetch comments for a specific target (recipe or post)
 * @param {string} targetId 
 * @param {string} targetType - 'recipe' | 'post'
 * @returns {Promise<Array>} Nested comment tree
 */
export async function fetchComments(targetId, targetType = 'recipe') {
    if (!targetId) return [];

    console.log(`🔵 Fetching comments for ${targetType}:`, targetId);

    const column = targetType === 'post' ? 'post_id' : 'recipe_id';

    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
            id,
            content,
            created_at,
            parent_comment_id,
            recipe_id,
            post_id,
            user_id,
            profiles:user_id (
                id,
                full_name,
                avatar_url,
                username
            )
        `)
        .eq(column, targetId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('🔴 Error fetching comments:', error);
        return [];
    }

    // Transform flat list to tree
    const commentMap = {};
    const roots = [];

    comments.forEach(comment => {
        comment.replies = [];
        commentMap[comment.id] = comment;
    });

    comments.forEach(comment => {
        if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
            commentMap[comment.parent_comment_id].replies.push(comment);
        } else {
            roots.push(comment);
        }
    });

    return roots;
}

/**
 * Post a comment
 * @param {Object} params
 */
export async function postComment({ userId, recipeId, postId, content, parentId = null, ownerId, parentAuthorId }) {
    console.log('🔵 Posting comment...', { userId, recipeId, postId, parentId });

    // 1. Insert Comment
    const payload = {
        user_id: userId,
        content: content,
        parent_comment_id: parentId
    };

    if (recipeId) payload.recipe_id = recipeId;
    if (postId) payload.post_id = postId;

    const { data: newComment, error } = await supabase
        .from('comments')
        .insert(payload)
        .select(`
            *,
            profiles:user_id (id, full_name, avatar_url, username)
        `)
        .single();

    if (error) throw error;

    // 2. Insert Notification
    try {
        let recipientId = null;
        let notifType = 'comment';

        // Determine entity type/id for notification link
        const entityType = recipeId ? 'recipe' : 'post';
        const entityId = recipeId || postId;

        if (parentId && parentAuthorId) {
            recipientId = parentAuthorId;
            notifType = 'reply';
        } else if (ownerId) {
            recipientId = ownerId;
            notifType = 'comment';
        }

        if (recipientId && recipientId !== userId) {
            await createNotification({
                userId: recipientId,
                actorId: userId,
                type: notifType,
                entityType: entityType,
                entityId: entityId
            });
        }
    } catch (notifError) {
        console.error('⚠️ Notification failed (non-blocking):', notifError);
    }

    return newComment;
}

/**
 * Create a notification record
 */
export async function createNotification({ userId, actorId, type, entityType, entityId }) {
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            actor_id: actorId,
            type,
            entity_type: entityType,
            entity_id: entityId,
            is_read: false
        });
    if (error) console.error('Error creating notification:', error);
}

/**
 * Fetch notifications for user
 */
export async function fetchNotifications(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select(`
            *,
            actor:actor_id (full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
    return data;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId) {
    if (!userId) return;

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Only update unread ones

    if (error) console.error('Error marking all read:', error);
}

/**
 * Mark single notification as read
 */
export async function markNotificationRead(notifId) {
    if (!notifId) return;
    await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
}

/**
 * Upload Recipe Wrapper (Fan out logic would go here or be server trigger)
 * Currently just a stub or we can integrate deeply.
 * For simplicity, we assume this is called AFTER regular upload.
 */
export async function notifyFollowersOfUpload(userId, recipeId) {
    // 1. Fetch followers
    const { data: followers } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId);

    if (!followers || followers.length === 0) return;

    // 2. Prepare batch inserts
    const notifications = followers.map(f => ({
        user_id: f.follower_id,
        actor_id: userId,
        type: 'upload',
        entity_type: 'recipe',
        entity_id: recipeId
    }));

    // 3. Batch insert
    const { error } = await supabase
        .from('notifications')
        .insert(notifications);

    if (error) console.error('Error fanning out upload notifications:', error);
    else console.log(`✅ Notified ${notifications.length} followers`);
}

/**
 * Follow or Unfollow a user
 */
export async function toggleFollow(followerId, followingId) {
    if (!followerId || !followingId) return false;

    // Check if following
    const { data: existing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

    if (existing) {
        // Unfollow
        await supabase.from('followers').delete().eq('id', existing.id);
        return false;
    } else {
        // Follow
        await supabase.from('followers').insert({
            follower_id: followerId,
            following_id: followingId
        });

        // Notify
        await createNotification({
            userId: followingId, // Recipient
            actorId: followerId, // Sender
            type: 'follow',
            entityType: 'profile',
            entityId: followerId // Actor's profile ID
        });

        return true;
    }
}

/**
 * Check follow status
 */
export async function checkFollowStatus(followerId, followingId) {
    if (!followerId || !followingId) return false;
    const { data } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();
    return !!data;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId, userId) {
    if (!commentId || !userId) return { error: 'Missing params' };

    // Verify ownership via RLS or explicit check? RLS is safer but explicit check gives better UX feedback if needed.
    // Assuming RLS allows delete methods for owner.

    // Check ownership first for safety in UI feedback
    const { data: comment } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

    if (!comment) return { error: 'Comment not found' };
    if (comment.user_id !== userId) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    return { error };
}

/**
 * Update a comment
 */
export async function updateComment(commentId, userId, content) {
    if (!commentId || !userId) return { error: 'Missing params' };

    const { data: comment } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

    if (!comment) return { error: 'Comment not found' };
    if (comment.user_id !== userId) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

    return { error };
}
