import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchRecipes, fetchRegions } from '../lib/recipeService';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams(); // Destructure setSearchParams to update URL properly without reload
    const searchQuery = searchParams.get('search') || '';
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedRegionId, setSelectedRegionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { bookmarkedRecipeIds, toggleBookmark } = useBookmarks();

    const handleBookmarkToggle = async (recipeId) => {
        if (!user) {
            // redir to login or show toast
            navigate('/login');
            return;
        }

        // Optimistic update using context
        const isCurrentlyBookmarked = bookmarkedRecipeIds.has(recipeId);
        toggleBookmark(recipeId, !isCurrentlyBookmarked);

        try {
            const { toggleBookmark: toggleBookmarkService } = await import('../lib/recipeService');
            await toggleBookmarkService(user.id, recipeId);
        } catch (error) {
            console.error('Bookmark error:', error);
            // Revert on error
            toggleBookmark(recipeId, isCurrentlyBookmarked);
        }
    };

    // Fetch regions on mount
    useEffect(() => {
        const loadRegions = async () => {
            const data = await fetchRegions();
            setRegions(data);
        };
        loadRegions();
    }, []);

    // Fetch recipes when search or region changes
    useEffect(() => {
        let mounted = true;
        const loadRecipes = async () => {
            setLoading(true);
            try {
                const data = await fetchRecipes({
                    searchQuery,
                    regionId: selectedRegionId,
                    limit: 10
                });
                if (mounted) {
                    setRecipes(data);
                }
            } catch (error) {
                if (mounted) console.error('Error loading recipes:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadRecipes();
        return () => { mounted = false; };
    }, [searchQuery, selectedRegionId]);

    const handleRegionClick = (id) => {
        if (selectedRegionId === id) {
            setSelectedRegionId(null); // Deselect if already selected
        } else {
            setSelectedRegionId(id);
        }
    };

    return (
        <main className="layout-container flex flex-col grow max-w-[1440px] mx-auto w-full px-4 md:px-10 py-5 gap-8">
            {/* Hero Section - Display only if no search query */}
            {!searchQuery && !selectedRegionId && (
                <section className="rounded-3xl bg-primary/10 dark:bg-accent-dark/50 p-6 md:p-10 relative overflow-hidden shadow-xl shadow-primary/5 border border-primary/10 dark:border-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 relative z-10 items-center">
                        <div className="flex flex-col gap-6 w-full lg:w-1/2">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                                    Nasi Liwet <span className="text-primary">Khas Sunda</span>
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=AT&background=EA6A12&color=fff")' }}></div>
                                    <p className="text-sm font-medium text-text-main dark:text-white">Oleh <span className="text-primary font-bold">Ataa</span></p>
                                </div>
                                <p className="text-text-secondary dark:text-gray-200 text-lg font-normal leading-relaxed">
                                    "Nasi liwet merupakan makanan tradisional khas Indonesia yang berasal dari Jawa, khususnya Solo (Surakarta) dan Sunda (Jawa Barat). Kata “liwet” berasal dari bahasa Jawa yang berarti memasak nasi dengan santan dan bumbu sehingga menghasilkan nasi yang gurih dan harum."
                                </p>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <Link to="/recipe/a6d3214c-0485-442c-97fe-e0fa96db47af" className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-terracotta-dark transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30">
                                    <span className="mr-2 material-symbols-outlined">restaurant_menu</span>
                                    <span className="truncate">Lihat Resep</span>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute inset-0 bg-black/10 rounded-2xl rotate-3 transform transition-transform group-hover:rotate-6"></div>
                            <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-center bg-no-repeat bg-cover rounded-2xl shadow-xl relative z-10" style={{ backgroundImage: 'url("https://weghbluslrzbkrzfuofu.supabase.co/storage/v1/object/public/recipes/main/1770187319968_jeb9z.jpg")' }}>
                                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">Paling Dicari</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Region Filter - Full Width Above Grid */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                    <span className="material-symbols-outlined text-primary">public</span>
                    <h3 className="text-text-main dark:text-white tracking-tight text-xl font-bold leading-tight">Jelajah Masa</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => handleRegionClick(region.id)}
                            className={`px-5 py-2.5 rounded-full border text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedRegionId === region.id
                                ? 'bg-primary border-primary text-white shadow-md transform scale-105'
                                : 'bg-background-light dark:bg-accent-dark border-primary/10 hover:bg-primary/10 hover:border-primary hover:text-primary text-text-main dark:text-white'
                                }`}
                        >
                            {region.name}
                        </button>
                    ))}
                    {regions.length === 0 && <div className="flex gap-2"><div className="w-20 h-10 bg-gray-100 rounded-full animate-pulse"></div><div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse"></div></div>}
                </div>
            </div>

            {/* Main Content Grid & Sidebar */}
            <div className="flex flex-col gap-10">
                <div className="w-full flex flex-col gap-8">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-primary/20">
                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            <h2 className="text-text-main dark:text-white tracking-tight text-[28px] font-bold leading-tight">
                                {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Jelajah Resep'}
                            </h2>
                        </div>

                        {/* Chef Recommendation - Moved here */}
                        <div className="flex gap-4 items-center bg-accent dark:bg-accent-dark/30 p-2 rounded-xl border border-primary/10 self-stretch md:self-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary px-2">Rekomendasi Kami</span>
                            <div className="w-px h-8 bg-primary/20"></div>
                            {[
                                { title: "Tekwan Ikan Tenggiri", img: "https://weghbluslrzbkrzfuofu.supabase.co/storage/v1/object/public/recipes/main/1770273093607_zeezun.jfif" },
                            ].map((chefRec, idx) => (
                                <div key={idx} onClick={() => navigate(`/recipe/${chefRec.id}`)} className="flex gap-3 items-center group cursor-pointer hover:opacity-80 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${chefRec.img}")` }}></div>
                                    <div className="flex flex-col w-32 lg:w-40">
                                        <h4 className="text-text-main dark:text-white font-bold text-xs leading-tight truncate">{chefRec.title}</h4>
                                        <span className="text-[10px] text-text-secondary">Coba sekarang</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : recipes.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                            {recipes.map((recipe) => (
                                <div onClick={() => navigate(`/recipe/${recipe.id}`)} key={recipe.id} className="group flex flex-col gap-2 cursor-pointer relative">
                                    <div className="w-full overflow-hidden rounded-xl aspect-square relative shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/600x400'}")` }}></div>
                                        {recipe.regions?.name && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-white/90 dark:bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-text-main dark:text-white shadow-sm">{recipe.regions.name}</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleBookmarkToggle(recipe.id);
                                            }}
                                            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur transition-colors shadow-sm ${bookmarkedRecipeIds.has(recipe.id) ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-white/30 text-white hover:bg-white/50'}`}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${bookmarkedRecipeIds.has(recipe.id) ? 'fill-current' : ''}`}>
                                                {bookmarkedRecipeIds.has(recipe.id) ? 'bookmark' : 'bookmark_border'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="px-1">
                                        <h3 className="text-text-main dark:text-white text-sm md:text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">{recipe.title}</h3>
                                        <div className="flex items-center gap-1.5 relative z-10">
                                            <Link
                                                to={`/public-profile?id=${recipe.user_id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                                            >
                                                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${recipe.user_profiles?.avatar_url || 'https://placehold.co/100x100'}")` }}></div>
                                                <p className="text-[10px] md:text-xs text-text-sub dark:text-gray-400 font-medium truncate max-w-[80px] md:max-w-none hover:underline">
                                                    {recipe.user_profiles?.full_name || 'Chef'}
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-background-light dark:bg-surface-dark border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">search_off</span>
                            <p className="text-text-secondary dark:text-gray-400 font-medium">Tidak ada resep ditemukan</p>
                            {(searchQuery || selectedRegionId) && (
                                <button
                                    onClick={() => {
                                        setSelectedRegionId(null);
                                        window.history.pushState({}, '', '/');
                                        // Force reload or just clear search params via navigation if using useNavigate
                                        navigate('/');
                                    }}
                                    className="mt-4 text-primary font-bold text-sm hover:underline"
                                >
                                    Reset Pencarian
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main >
    );
};

export default Home;
