import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postComment } from '../lib/interactionService';

const CommentForm = ({ recipeId, postId, parentId = null, onSuccess, onCancel, autoFocus = false, replyToAuthorId = null, ownerId = null }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, profile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        setLoading(true);
        try {
            const newComment = await postComment({
                userId: user.id,
                recipeId,
                postId, // Pass postId
                content: content.trim(),
                parentId: parentId, // Explicitly pass parentId
                ownerId, // Renamed from recipeOwnerId for generic use
                parentAuthorId: replyToAuthorId
            });

            setContent('');
            if (onSuccess) onSuccess(newComment);
        } catch (error) {
            console.error('Failed to post comment:', error);
            alert('Gagal mengirim komentar. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-accent-dark/30 rounded-xl text-center border border-dashed border-gray-300">
                <p className="text-sm text-text-secondary">
                    Silakan <Link to="/login" className="text-primary hover:underline font-bold">login</Link> untuk berkomentar
                </p>
            </div>
        );
    }

    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://placehold.co/100x100';

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 w-full">
            {/* Show User Avatar only for main comments, maybe simpler to always show or hide on reply if tight space. HTML shows it. */}
            <div className="hidden sm:block w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-border-color shadow-sm"
                style={{ backgroundImage: `url('${avatarUrl}')` }}>
            </div>

            <div className="flex-1 relative">
                <textarea
                    className="w-full rounded-xl border border-border-color dark:border-gray-700 bg-background-light dark:bg-surface-dark p-3 pb-12 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none placeholder:text-text-secondary/70 text-text-main dark:text-white"
                    placeholder={parentId ? "Tulis balasan..." : "Bagikan pengalaman memasakmu..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    autoFocus={autoFocus}
                    required
                    rows={parentId ? 2 : 3}
                />

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                )}

                <div className="absolute bottom-3 right-3">
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className={`bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm transition-all hover:shadow-primary/20 ${loading || !content.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '...' : 'Kirim'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;