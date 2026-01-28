import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';
import { deleteComment, updateComment } from '../lib/interactionService';

const CommentItem = ({ comment, onReply, onDelete, onUpdate }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isDeleting, setIsDeleting] = useState(false);

    // Format date (e.g., "2 jam yang lalu" or simple date)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const handleReplySuccess = () => {
        setIsReplying(false);
        if (onReply) onReply();
    };

    const handleDelete = async () => {
        if (!confirm('Hapus komentar ini?')) return;
        setIsDeleting(true);
        const { error } = await deleteComment(comment.id, user.id);
        if (!error) {
            if (onReply) onReply(); // Refresh comments
        } else {
            alert('Gagal menghapus komentar');
        }
        setIsDeleting(false);
    };

    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        const { error } = await updateComment(comment.id, user.id, editContent);
        if (!error) {
            setIsEditing(false);
            if (onReply) onReply(); // Refresh comments
        } else {
            alert('Gagal mengupdate komentar');
        }
    };

    const isOwner = user && user.id === comment.user_id;

    return (
        <div className="flex gap-4 anim-fade-in group">
            {/* Avatar */}
            <Link to={`/public-profile?id=${comment.user_id}`} className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url('${comment.profiles?.avatar_url || 'https://placehold.co/100x100'}')` }}>
                </div>
            </Link>

            <div className="flex-1">
                {/* Comment Bubble */}
                <div className="bg-background-light dark:bg-surface-dark p-4 rounded-2xl rounded-tl-none border border-border-color dark:border-border-dark relative group/bubble">
                    <div className="flex justify-between items-start mb-1">
                        <Link to={`/public-profile?id=${comment.user_id}`} className="hover:underline">
                            <h5 className="font-bold text-sm text-text-main dark:text-white">{comment.profiles?.full_name || 'User'}</h5>
                        </Link>
                        <span className="text-xs text-text-secondary dark:text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white dark:bg-[#1a1c20] border border-primary/30 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Batal</button>
                                <button onClick={handleUpdate} className="text-xs font-bold text-primary hover:text-orange-700">Simpan</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-text-main dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    )}

                    {/* Owner Actions */}
                    {isOwner && !isEditing && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex gap-1 bg-background-light/80 dark:bg-surface-dark/80 backdrop-blur rounded-lg p-1">
                            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-500" title="Edit">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500" title="Delete" disabled={isDeleting}>
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {!isEditing && (
                    <div className="flex items-center gap-4 mt-2 ml-2">
                        {user && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-xs font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer"
                            >
                                Balas
                            </button>
                        )}
                    </div>
                )}

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-4">
                        <CommentForm
                            recipeId={comment.recipe_id}
                            postId={comment.post_id}
                            parentId={comment.id}
                            onSuccess={handleReplySuccess}
                            onCancel={() => setIsReplying(false)}
                            autoFocus={true}
                            replyToAuthorId={comment.profiles?.id}
                        />
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
