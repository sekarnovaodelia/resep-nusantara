import { supabase } from './supabaseClient';
import { createNotification } from './interactionService';

/**
 * Fetch consolidated profile stats (followers, following, recipes) in a single operation
 * @param {string} userId - User ID to fetch stats for
 * @returns {Promise<Object>} - Object with followers, following, and recipes counts
 */
export async function fetchProfileStats(userId) {
    if (!userId) return { followers: 0, following: 0, recipes: 0 };

    try {
        const [followersResult, followingResult, recipesResult] = await Promise.all([
            supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', userId),
            supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', userId),
            supabase
                .from('recipes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_published', true)
        ]);

        console.log('✅ Profile stats fetched for user:', userId);

        return {
            followers: followersResult.count || 0,
            following: followingResult.count || 0,
            recipes: recipesResult.count || 0
        };
    } catch (error) {
        console.error('🔴 Error fetching profile stats:', error);
        return { followers: 0, following: 0, recipes: 0 };
    }
}

/**
 * Fetch posts with pagination and sorting
 * @param {Object} options
 * @param {number} options.page - Page index (0-based)
 * @param {number} options.limit - Items per page
 * @param {string} options.sortBy - 'latest' | 'popular'
 */
export async function fetchPosts({ page = 0, limit = 10, sortBy = 'latest' } = {}) {
    const from = page * limit;
    const to = from + limit - 1;

    console.log(`🔵 Fetching posts (${sortBy}) range: ${from}-${to}`);

    const query = supabase
        .from('posts')
        .select(`
            id,
            content,
            image_url,
            created_at,
            user_id,
            mentioned_recipe_id,
            likes_count,
            profiles:user_id (
                id,
                full_name,
                username,
                avatar_url
            ),
            recipes:mentioned_recipe_id (
                id,
                title,
                main_image_url
            ),
            post_likes (count),
            comments (count),
            likes:post_likes (user_id) 
        `);

    if (sortBy === 'popular') {
        query.order('likes_count', { ascending: false }).order('created_at', { ascending: false });
    } else {
        query.order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(from, to);

    if (error) {
        console.error('🔴 Error fetching posts:', error);
        return [];
    }

    // Transform data for UI
    return data.map(post => {
        // Check if current user liked (need to pass userId to this func essentially, 
        // to filter likes array efficiently in DB or map here. 
        // For simplicity, we fetch all likes ids or count? 
        // 'likes:post_likes (user_id)' fetches ALL likers. 
        // Better: rely on client to check if their ID is in list or separate query.
        // For MVP with small scale, mapping is fine. For scale, use RPC or specific filter.
        // We will inject `currentUserId` logic in the Component or separate check.

        return {
            id: post.id,
            userId: post.user_id,
            avatar: post.profiles?.avatar_url,
            name: post.profiles?.full_name || post.profiles?.username,
            username: post.profiles?.username,
            time: post.created_at, // Formatting happens in UI
            location: "Indonesia", // Placeholder or from profile
            content: post.content,
            image: post.image_url,

            // Recipe Mention
            recipeId: post.recipes?.id,
            recipeTitle: post.recipes?.title,
            recipeImage: post.recipes?.main_image_url,

            likesCount: post.likes_count || 0, // Use the new column
            commentsCount: post.comments?.[0]?.count || 0,

            // Raw likes array to determine 'likedByMe' in component 
            likedCheck: post.likes || []
        };
    });
}

/**
 * Create a new post
 */
export async function createPost({ userId, content, mentionedRecipeId = null, imageUrl = null }) {
    if (!userId) return { error: 'Unauthorized' };
    if (!content && !mentionedRecipeId) return { error: 'Cannot create empty post' };

    const { data, error } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            content,
            mentioned_recipe_id: mentionedRecipeId,
            image_url: imageUrl,
            likes_count: 0 // Initialize
        })
        .select(`
             *,
            profiles:user_id (id, full_name, username, avatar_url),
            recipes:mentioned_recipe_id (id, title, main_image_url)
        `)
        .single();

    if (error) {
        console.error('🔴 Create post error:', error);
        return { error };
    }

    return { data };
}

/**
 * Toggle Like on a Post
 */
export async function toggleLikePost(postId, userId) {
    if (!userId) return { error: 'Unauthorized' };

    // 1. Check if liked
    const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    let liked = false;
    let error = null;

    if (existing) {
        // Unlike
        const { error: delError } = await supabase
            .from('post_likes')
            .delete()
            .eq('id', existing.id);
        error = delError;
        liked = false;
    } else {
        // Like
        const { error: insError } = await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: userId });
        error = insError;
        liked = true;
    }

    if (!error) {
        // 2. Update likes_count column in posts table
        // We fetch current count to avoid race conditions or just use sync if we trust it.
        // For simple implementation, we'll fetch and update.
        const { data: post } = await supabase.from('posts').select('likes_count, user_id').eq('id', postId).single();
        if (post) {
            const newCount = Math.max(0, (post.likes_count || 0) + (liked ? 1 : -1));
            await supabase.from('posts').update({ likes_count: newCount }).eq('id', postId);

            // 3. Notify post owner (if liking and not self)
            if (liked && post.user_id !== userId) {
                await createNotification({
                    userId: post.user_id,
                    actorId: userId,
                    type: 'like',
                    entityType: 'post',
                    entityId: postId
                });
            }
        }
    }

    return { liked, error };
}
