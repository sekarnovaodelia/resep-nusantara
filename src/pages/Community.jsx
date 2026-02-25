import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeedCard from '../components/FeedCard';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost } from '../lib/socialService';
import { fetchRecipes } from '../lib/recipeService';

const Community = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('terbaru');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const suggestionRef = useRef(null);

    // Feed State
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const ITEMS_PER_PAGE = 10;

    // Post creation
    const [newPostText, setNewPostText] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    // Recipe Suggestions (Real)
    const [userRecipes, setUserRecipes] = useState([]);

    useEffect(() => {
        const loadUserRecipes = async () => {
            if (user) {
                const { data } = await fetchRecipes({ userId: user.id, limit: 100 });
                setUserRecipes(data);
            }
        };
        loadUserRecipes();
    }, [user]);

    // User data from auth
    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Pengguna';
    const username = profile?.username || user?.user_metadata?.username || 'user';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || (user ? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=EA6A12&color=fff' : 'https://ui-avatars.com/api/?name=Guest&background=EA6A12&color=fff');

    // Stats (Mock for now, can be updated to real if needed)
    const stats = {
        recipes: userRecipes.length, // Updated to use real length
        followers: 0,
        saved: 0
    };


    // 1. Fetch Posts on Mount and on Tab Change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        loadPosts(0, activeTab === 'terbaru' ? 'latest' : 'popular');
    }, [activeTab]); // Trigger on tab change

    const loadPosts = async (pageIndex, sortBy = activeTab === 'terbaru' ? 'latest' : 'popular') => {
        if (pageIndex === 0) setLoading(true);
        else setLoadingMore(true);

        try {
            const newPosts = await fetchPosts({
                page: pageIndex,
                limit: ITEMS_PER_PAGE,
                sortBy: sortBy
            });

            if (newPosts.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (pageIndex === 0) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadPosts(nextPage);
    };

    const handlePost = async () => {
        if ((!newPostText.trim() && !selectedRecipe) || !user) return;

        setIsPosting(true);
        try {
            const { data, error } = await createPost({
                userId: user.id,
                content: newPostText,
                mentionedRecipeId: selectedRecipe?.id
            });

            if (error) throw error;

            // Optimistic Prepend
            const newPostFormatted = {
                id: data.id,
                userId: user.id,
                avatar: avatarUrl,
                name: displayName,
                username: username,
                time: new Date().toISOString(),
                location: "Indonesia",
                content: data.content,
                image: data.image_url,
                recipeId: data.recipes?.id,
                recipeTitle: data.recipes?.title,
                recipeImage: data.recipes?.main_image_url,
                likesCount: 0,
                commentsCount: 0,
                likedCheck: []
            };

            setPosts([newPostFormatted, ...posts]);
            setNewPostText('');
            setSelectedRecipe(null);

        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Gagal memposting status.');
        } finally {
            setIsPosting(false);
        }
    }

    // Dropdown handling
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setIsSuggestionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsSuggestionsOpen(false);
    }

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Navigation & User (Sticky) */}
                <aside className="hidden md:block md:col-span-3 sticky top-24 space-y-6">
                    {/* User Mini Card */}
                    {user && (
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col items-center text-center">
                            <div className="size-20 rounded-full bg-cover bg-center mb-4 ring-4 ring-orange-50 dark:ring-white/5" data-alt={`Profile photo of ${displayName}`} style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                            <h3 className="font-bold text-lg leading-tight text-text-main dark:text-white">{displayName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">@{username}</p>
                            <div className="mt-6 flex w-full justify-between px-2 text-sm text-text-main dark:text-white">
                                <Link to="/profile" className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer">
                                    <span className="font-bold text-lg">{stats.recipes}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Resep</span>
                                </Link>
                                <Link to="/profile" className="flex flex-col border-x border-[#e7d9cf] dark:border-[#3d2f26] w-full mx-2 hover:opacity-80 transition-opacity cursor-pointer">
                                    <span className="font-bold text-lg">{stats.followers}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Pengikut</span>
                                </Link>
                                <Link to="/planner" className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer">
                                    <span className="font-bold text-lg">{stats.saved}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Disimpan</span>
                                </Link>
                            </div>
                        </div>
                    )}
                    {/* Community Nav */}
                    <nav className="bg-card-light dark:bg-card-dark p-2 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab('terbaru')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'terbaru' ? 'bg-orange-50 dark:bg-white/5 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined">rss_feed</span>
                            Feed Terbaru
                        </button>
                        <button
                            onClick={() => setActiveTab('populer')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'populer' ? 'bg-orange-50 dark:bg-white/5 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined">trending_up</span>
                            Populer
                        </button>
                    </nav>
                </aside>

                {/* Center Column: Feed (Scrollable) */}
                <section className="col-span-1 md:col-span-9 lg:col-span-9 space-y-4 sm:space-y-6">
                    {/* Mobile Tabs */}
                    <div className="md:hidden flex border-b border-[#e7d9cf] dark:border-[#3d2f26] mb-2 sticky top-[64px] bg-background-light dark:bg-background-dark z-20 -mx-4 px-4">
                        <button
                            onClick={() => setActiveTab('terbaru')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'terbaru' ? 'text-primary' : 'text-text-secondary'}`}
                        >
                            Feed Terbaru
                            {activeTab === 'terbaru' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('populer')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'populer' ? 'text-primary' : 'text-text-secondary'}`}
                        >
                            Populer
                            {activeTab === 'populer' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                        </button>
                    </div>

                    {/* Status Composer */}
                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26]">
                        <div className="flex gap-4">
                            <div className="size-10 rounded-full bg-cover bg-center flex-shrink-0" data-alt="User avatar" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                            <div className="flex-grow">
                                {!user ? (
                                    <div className="w-full bg-[#f8f7f6] dark:bg-[#221810] border-none rounded-xl px-4 py-3 text-sm text-text-secondary dark:text-gray-400">
                                        Silakan <Link to="/login" className="text-primary hover:underline font-bold">login</Link> untuk membagikan resep atau tips masak
                                    </div>
                                ) : (
                                    <input
                                        className="w-full bg-[#f8f7f6] dark:bg-[#221810] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white placeholder-gray-400 outline-none"
                                        placeholder="Punya tips masak atau resep baru?"
                                        type="text"
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Composer Recipe Widget */}
                        {selectedRecipe && (
                            <div className="mt-3 w-full">
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-orange-50 dark:bg-[#3d2f26] p-3 rounded-xl border border-orange-100 dark:border-white/5 hover:bg-orange-100 dark:hover:bg-white/10 transition-colors group/widget relative"
                                >
                                    {/* Image */}
                                    <div
                                        className="w-full aspect-video sm:size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                        data-alt="Recipe thumbnail"
                                        style={{ backgroundImage: `url("${selectedRecipe.main_image_url || 'https://placehold.co/100x100'}")` }}
                                    ></div>

                                    {/* Text Info */}
                                    <div className="flex-grow w-full sm:w-auto">
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">Masak Resep</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/widget:text-primary transition-colors line-clamp-2">{selectedRecipe.title}</p>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); }}
                                        className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto text-gray-400 hover:text-red-500 transition-colors bg-white/50 sm:bg-transparent rounded-full p-1 sm:p-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#f3ece7] dark:border-[#3d2f26] px-2 relative">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
                                    className={`flex items-center gap-2 transition-colors text-sm font-medium ${isSuggestionsOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                                    Mention Resep
                                </button>

                                {/* Recipe Suggestions Dropdown */}
                                {isSuggestionsOpen && (
                                    <div ref={suggestionRef} className="absolute left-0 top-full mt-2 w-72 bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl border border-[#e7d9cf] dark:border-[#3d2f26] overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-[#f3ece7] dark:border-[#3d2f26] bg-orange-50/30 dark:bg-white/5">
                                            <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Pilih Resep Anda</p>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto py-1">
                                            {userRecipes.length === 0 ? (
                                                <div className="p-4 text-center text-xs text-gray-500">
                                                    Anda belum memiliki resep yang dipublikasikan.
                                                </div>
                                            ) : (
                                                userRecipes.map((recipe) => (
                                                    <button
                                                        key={recipe.id}
                                                        onClick={() => handleSelectRecipe(recipe)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left group"
                                                    >
                                                        <div className="size-11 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-white/10" style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/100x100'}")` }}></div>
                                                        <div className="flex-grow min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">{recipe.title}</p>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Klik untuk mention</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handlePost}
                                disabled={(!newPostText.trim() && !selectedRecipe) || isPosting}
                                className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5"
                            >
                                {isPosting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>

                    {/* Feed Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6">
                            {posts.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">Belum ada postingan. Jadilah yang pertama!</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <FeedCard key={post.id} {...post} />
                                ))
                            )}

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center pt-4 pb-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm font-bold text-text-secondary hover:text-primary hover:border-primary transition-all disabled:opacity-50"
                                    >
                                        {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Community;
