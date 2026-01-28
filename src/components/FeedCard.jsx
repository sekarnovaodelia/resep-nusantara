import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toggleLikePost } from '../lib/socialService';
import { fetchComments } from '../lib/interactionService';
import { useAuth } from '../context/AuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const FeedCard = ({
    id,
    avatar,
    name,
    userId,
    time,
    location,
    content,
    image,
    recipeId,
    recipeTitle,
    recipeImage,
    likesCount,    // Match service
    commentsCount, // Match service
    likedCheck = [],
    isDetailView = false
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Optimistic Like State
    const initialLiked = user ? likedCheck.some(l => l.user_id === user.id) : false;
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(likesCount || 0);
    const [likeLoading, setLikeLoading] = useState(false);

    // Comment State
    const [isCommentOpen, setIsCommentOpen] = useState(isDetailView);
    const [commentCount, setCommentCount] = useState(commentsCount || 0);
    const [commentsList, setCommentsList] = useState([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const handleCardClick = (e) => {
        // Only navigate if clicking strictly on card background, not interactive elements
        // (Handled by stopPropagation on children)
        if (id && !isDetailView) {
            // navigate(`/post/${id}`); // Disabled for now unless post detail exists
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user || likeLoading) return;

        // Optimistic Update
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!previousLiked);
        setLikeCount(prev => previousLiked ? prev - 1 : prev + 1);
        setLikeLoading(true);

        try {
            const { error } = await toggleLikePost(id, user.id);
            if (error) throw error;
        } catch (error) {
            console.error('Like failed:', error);
            // Rollback
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleCommentClick = async (e) => {
        e.stopPropagation();
        if (!isCommentOpen) {
            setIsCommentOpen(true);
            if (!commentsLoaded) {
                setCommentsLoading(true);
                const data = await fetchComments(id, 'post');
                setCommentsList(data);
                setCommentsLoaded(true);
                setCommentsLoading(false);
            }
        } else {
            setIsCommentOpen(false);
        }
    };

    const reloadComments = async () => {
        const data = await fetchComments(id, 'post');
        setCommentsList(data);
        setCommentCount(prev => prev + 1); // Simple increment for immediate feedback
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (userId) {
            navigate(`/public-profile?id=${userId}`);
        }
    };

    return (
        <article
            onClick={handleCardClick}
            className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] overflow-hidden transition-all duration-200 hover:shadow-md cursor-default group/card w-full"
        >
            {/* Card Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        onClick={handleProfileClick}
                        className="size-10 rounded-full bg-cover bg-center border border-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
                        data-alt={`Avatar of ${name}`}
                        style={{ backgroundImage: `url("${avatar || 'https://placehold.co/100x100'}")` }}
                    ></div>
                    <div onClick={handleProfileClick} className="hover:underline cursor-pointer">
                        <h4 className="font-bold text-sm text-text-main dark:text-white">{name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {/* Simple time logic if time is ISO string, else display as is */}
                            <span>{time && time.includes('T') ? new Date(time).toLocaleDateString() : time}</span>
                            {location && <span>• {location}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="pb-4">
                {/* Card Content Text */}
                <div className="px-4 pb-3">
                    <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                        {content}
                    </div>
                </div>
                {/* Card Image */}
                {image && (
                    <div className="px-4">
                        <div className="w-full aspect-video bg-gray-100 relative overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105" data-alt="Post image" style={{ backgroundImage: `url("${image}")` }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recipe Link Widget */}
            {recipeId && recipeTitle && (
                <div className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Link className="flex items-center gap-3 bg-orange-50 dark:bg-[#3d2f26] p-3 rounded-xl border border-orange-100 dark:border-white/5 hover:bg-orange-100 dark:hover:bg-white/10 transition-colors group/widget" to={`/recipe/${recipeId}`}>
                        <div className="size-12 rounded-lg bg-cover bg-center flex-shrink-0" data-alt="Recipe thumbnail" style={{ backgroundImage: `url("${recipeImage || 'https://placehold.co/100x100'}")` }}></div>
                        <div className="flex-grow min-w-0">
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">Masak Resep</p>
                            <p className="text-sm font-bold text-text-main dark:text-white group-hover/widget:text-primary transition-colors truncate">{recipeTitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary">chevron_right</span>
                    </Link>
                </div>
            )}

            {/* Card Actions */}
            <div className="px-4 py-3 border-t border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <span className={`material-symbols-outlined text-[24px] ${isLiked ? 'fill-current' : 'group-hover:text-red-500'}`}>
                                {isLiked ? 'favorite' : 'favorite_border'}
                            </span>
                            <span className={`text-sm font-semibold ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                {likeCount >= 1000 ? (likeCount / 1000).toFixed(1) + 'k' : likeCount}
                            </span>
                        </button>
                        <button
                            onClick={handleCommentClick}
                            className={`flex items-center gap-2 group transition-colors ${isCommentOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                        >
                            <span className={`material-symbols-outlined text-[24px] ${isCommentOpen ? 'fill-current' : ''}`}>chat_bubble</span>
                            <span className={`text-sm font-semibold ${isCommentOpen ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                {commentCount}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Comment Section (Inline) */}
                {isCommentOpen && (
                    <div className="flex flex-col gap-4 animate-fade-in pt-2 border-t border-dashed border-[#e7d9cf] dark:border-[#3d2f26] mt-2" onClick={(e) => e.stopPropagation()}>

                        {/* Loading State */}
                        {commentsLoading && (
                            <div className="flex justify-center py-4">
                                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Comment List */}
                        {!commentsLoading && (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                {commentsList.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 py-2">Belum ada komentar.</p>
                                ) : (
                                    commentsList.map(comment => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            onReply={reloadComments}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Comment Input */}
                        <div className="mt-2">
                            <CommentForm
                                postId={id}
                                onSuccess={reloadComments}
                                ownerId={userId} // Post owner
                            />
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default FeedCard;
