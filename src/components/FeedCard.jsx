import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FeedCard = ({
    id,
    avatar,
    name,
    time,
    location,
    content,
    image,
    recipeId,
    recipeTitle,
    recipeImage,
    likes,
    comments,
    initialLiked = false,
    isDetailView = false
}) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(likes);
    const [isCommentOpen, setIsCommentOpen] = useState(isDetailView);
    const [commentCount, setCommentCount] = useState(comments);

    const navigate = useNavigate();

    const handleCardClick = () => {
        if (id && !isDetailView) {
            navigate(`/post/${id}`);
        }
    };

    const handleLike = (e) => {
        e.stopPropagation();
        if (isLiked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        if (!isDetailView) {
            navigate(`/post/${id}`);
        }
    };

    const handleActionClick = (e) => {
        e.stopPropagation();
    };

    return (
        <article
            onClick={handleCardClick}
            className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group/card w-full"
        >
            {/* Card Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-cover bg-center border border-gray-100" data-alt={`Avatar of ${name}`} style={{ backgroundImage: `url("${avatar}")` }}></div>
                    <div>
                        <h4 className="font-bold text-sm text-text-main dark:text-white">{name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{time} • {location}</p>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="pb-4">
                {/* Card Content Text */}
                <div className="px-4 pb-3">
                    <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
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
                        <div className="size-12 rounded-lg bg-cover bg-center flex-shrink-0" data-alt="Recipe thumbnail" style={{ backgroundImage: `url("${recipeImage}")` }}></div>
                        <div className="flex-grow min-w-0">
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">Masak Resep</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/widget:text-primary transition-colors truncate">{recipeTitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary">chevron_right</span>
                    </Link>
                </div>
            )}

            {/* Card Actions */}
            <div className="px-4 py-3 border-t border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col gap-3">
                <div className="flex items-center justify-between" onClick={handleActionClick}>
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
                            className={`flex items-center gap-2 group transition-colors ${isCommentOpen ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                            <span className={`text-sm font-semibold ${isCommentOpen ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                {commentCount}
                            </span>
                        </button>
                        <button className="flex items-center gap-2 group">
                            <span className="material-symbols-outlined text-[24px] text-gray-500 group-hover:text-green-500 transition-colors">share</span>
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">bookmark</span>
                    </button>
                </div>

                {/* Comment Section */}
                {isCommentOpen && (
                    <div className="flex flex-col gap-4 animate-fade-in pt-2" onClick={handleActionClick}>
                        {/* Dummy Comments */}
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="size-8 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIL3OOZRbwVs7oQAMnlwq2-CizOvqf8Cq47LcuOoYDCdJXjY75ruGbuAbpOF73IX9LMcwPWAnopch-p8VtHHnm8uIBFQRFfFciJi_mgNyrnkp4bP7XRS72IJcylUY19Qib16AkHFByVXvOWBIRgG0bXQ7gmXGSrOOThe53f1TUrMev6qOgL_kg4VsAihY5_wEkwrlpfjJWvfj-j59fO32d762o20O_xWDQws4CZXEtBvE0-MoLOYu2kBbdja48vVpPUJ6dp8nDMI1D")' }}></div>
                                <div className="bg-background-light dark:bg-background-dark p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm">
                                    <p className="font-bold text-text-main dark:text-white mb-0.5">Chef Juna KW</p>
                                    <p className="text-gray-700 dark:text-gray-300">Wah, mantap nih! Kapan-kapan saya coba teknik santan kentalnya.</p>
                                </div>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-3 items-start">
                            <div className="size-8 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8J315noBaNEdtwTrAyup1A9QieHqJz5nU5XsOEsX_koP1HV2eumHSICTYGusis3uVnCIza54-2rHqpLLK5wJs7BixvGsvsgl-VAPqpCMecAc9oxCtqCkpaZRyPaTss7KxH0XJ1anh3MmtAlIvH9--DqCBvYyo4fAanLxYZZPtJJr5EQSQGjMqueSM5OqBdOw4aLBAlALIW0-95p4W3flidWv99b6oi0mkZph4_uaVkjcdqui5XlSb4bH0llSrbdEhOzw2VtAlUjFp")' }}></div>
                            <div className="flex-grow flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tulis komentar..."
                                    className="w-full bg-[#f8f7f6] dark:bg-[#221810] border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary/50 text-text-main dark:text-white placeholder-gray-400 outline-none"
                                />
                                <button className="text-primary font-bold text-sm px-2 hover:bg-orange-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    Kirim
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default FeedCard;
