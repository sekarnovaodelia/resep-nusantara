import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchRecipes, fetchRegions } from '../lib/recipeService';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [recipes, setRecipes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedRegionId, setSelectedRegionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookmarkedRecipeIds, setBookmarkedRecipeIds] = useState(new Set());
    const { user } = useAuth();

    // Fetch user bookmarks to sync UI
    useEffect(() => {
        if (user) {
            const loadBookmarks = async () => {
                const { supabase } = await import('../lib/supabaseClient');
                const { data } = await supabase
                    .from('bookmarks')
                    .select('recipe_id')
                    .eq('user_id', user.id);

                if (data) {
                    setBookmarkedRecipeIds(new Set(data.map(b => b.recipe_id)));
                }
            };
            loadBookmarks();
        } else {
            setBookmarkedRecipeIds(new Set());
        }
    }, [user]);

    const handleBookmarkToggle = async (recipeId) => {
        if (!user) {
            // redir to login or show toast
            window.location.href = '/login';
            return;
        }

        // Optimistic update
        setBookmarkedRecipeIds(prev => {
            const next = new Set(prev);
            if (next.has(recipeId)) {
                next.delete(recipeId);
            } else {
                next.add(recipeId);
            }
            return next;
        });

        try {
            const { toggleBookmark } = await import('../lib/recipeService');
            await toggleBookmark(user.id, recipeId);
        } catch (error) {
            console.error('Bookmark error:', error);
            // Revert on error (could implement)
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
        const loadRecipes = async () => {
            setLoading(true);
            try {
                const data = await fetchRecipes({
                    searchQuery,
                    regionId: selectedRegionId,
                    limit: 10
                });
                setRecipes(data);
            } catch (error) {
                console.error('Error loading recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
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
                                    Rendang Daging <span className="text-primary">Khas Padang</span>
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiudVFcBmZ9AfmiNoLPKubaTtsZW3IkqNPN5VVx5viH8zqJBcEB6zfyxrL0fzs5v3kx4u1iVtBHOTjmK5gZ0u_piHfwNVBKMw2Im7ftgTnDi-sTIwWIleVxi35QdeUpfVCD-qV1rD2FU7A4E36bPUuK4Vr73a9puWe-eEnahuT0DP4Pmnp1_8IemxOISLa3s772NecnAxz-RIYFfg-owYOBl_qz7UlITLiwNfsNjxP74nggi3hroxH18Iwstcqxy6cvjOqNXf4BJE2")' }}></div>
                                    <p className="text-sm font-medium text-text-main dark:text-white">Oleh <span className="text-primary font-bold">Chef Siti</span></p>
                                </div>
                                <p className="text-text-secondary dark:text-gray-200 text-lg font-normal leading-relaxed">
                                    "Resep rendang asli Payakumbuh yang dimasak perlahan dengan santan kental dan rempah-rempah pilihan hingga bumbu meresap sempurna."
                                </p>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <Link to="/recipe/rendang" className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-terracotta-dark transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30">
                                    <span className="mr-2 material-symbols-outlined">restaurant_menu</span>
                                    <span className="truncate">Lihat Resep</span>
                                </Link>
                                <button className="flex w-12 h-12 cursor-pointer items-center justify-center rounded-xl bg-background-light dark:bg-accent-dark hover:bg-accent dark:hover:bg-accent-dark/80 transition-colors text-text-main dark:text-white shadow-sm border border-primary/10">
                                    <span className="material-symbols-outlined">bookmark</span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute inset-0 bg-black/10 rounded-2xl rotate-3 transform transition-transform group-hover:rotate-6"></div>
                            <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-center bg-no-repeat bg-cover rounded-2xl shadow-xl relative z-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuonMqfbD4UwTdSTu_S07nedh_XNT-eRqd4uMOH83FSqmdVOS1mh0Kknq9Zo8LZNGM83y8hj2mFKAi0T70JNoKKhYXJcrkopvift42INd31KGrA_Qf-fmKcvgOvfdDiiaXy3lhdTPm5fvC3KZGJUA9lnD5guGkbtMBbxVE5x7r86nOXR9p4tpSHAi2SDGpmt56BdB9JfA81T3vT67T7uriRAZ8vy1GYG9s6mlK7icqqvB5J9mIL3pw-x7M8LDOEjtgBq6zctdsATV4")' }}>
                                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">Paling Dicari</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-3/4 flex flex-col gap-8">
                    <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            <h2 className="text-text-main dark:text-white tracking-tight text-[28px] font-bold leading-tight">
                                {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Jelajah Resep'}
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : recipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                            {recipes.map((recipe) => (
                                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="group flex flex-col gap-3 cursor-pointer">
                                    <div className="w-full overflow-hidden rounded-2xl aspect-[4/3] relative shadow-md group-hover:shadow-xl transition-all duration-300">
                                        <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/600x400'}")` }}></div>
                                        {recipe.regions?.name && (
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/90 dark:bg-black/70 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-text-main dark:text-white">{recipe.regions.name}</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Handle bookmark logic here - ideally passed from parent or context
                                                // For now, let's navigate to detail to bookmark as feed bookmarking requires complex state sync
                                                // OR implement a simple quick toggle if we have the data.
                                                // Given the complexity of sync, and user request "bisa di klik bookmark", let's assume detail workflow is safer OR implement full feed logic.
                                                // Let's try to implement full feed logic by loading bookmarks.
                                                handleBookmarkToggle(recipe.id);
                                            }}
                                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-colors ${bookmarkedRecipeIds.has(recipe.id) ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${bookmarkedRecipeIds.has(recipe.id) ? 'fill-current' : ''}`}>
                                                {bookmarkedRecipeIds.has(recipe.id) ? 'bookmark' : 'bookmark_border'}
                                            </span>
                                        </button>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1 gap-2">
                                            <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{recipe.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url("${recipe.user_profiles?.avatar_url || 'https://placehold.co/100x100'}")` }}></div>
                                            <p className="text-xs text-text-secondary dark:text-gray-400 font-medium truncate">
                                                {recipe.user_profiles?.full_name || 'Chef'}
                                            </p>
                                        </div>
                                        {recipe.regions?.name && (
                                            <p className="text-text-secondary dark:text-gray-400 text-sm flex items-center gap-1 mt-2">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span> {recipe.regions.name}
                                            </p>
                                        )}
                                    </div>
                                </Link>
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
                                        window.location.href = '/';
                                    }}
                                    className="mt-4 text-primary font-bold text-sm hover:underline"
                                >
                                    Reset Pencarian
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <aside className="w-full lg:w-1/4 flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                            <span className="material-symbols-outlined text-primary">public</span>
                            <h3 className="text-text-main dark:text-white tracking-tight text-xl font-bold leading-tight">Jelajah Masa</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {regions.map((region) => (
                                <button
                                    key={region.id}
                                    onClick={() => handleRegionClick(region.id)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedRegionId === region.id
                                        ? 'bg-primary border-primary text-white shadow-md'
                                        : 'bg-background-light dark:bg-accent-dark border-primary/10 hover:bg-primary/10 hover:border-primary hover:text-primary text-text-main dark:text-white'
                                        }`}
                                >
                                    {region.name}
                                </button>
                            ))}
                            {regions.length === 0 && <p className="text-sm text-gray-500">Memuat wilayah...</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-accent dark:bg-accent-dark/30 border border-primary/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-text-main dark:text-white tracking-tight text-lg font-bold leading-tight">Rekomendasi Chef</h3>
                            <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Lihat Semua</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { title: "Nasi Goreng Kampung", time: "20m", rating: "4.5", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuByg5jxqle7nHuppOMXhJdVandrhYIwOq7fTwtbeaba8yyTIiqU3TNyuCvQWF79BQ5NrtxpLXjpgXf_iunQW-e9P2kffyxRbBZGHTsXRn1PDX5HKVh5LAAB6tnvxACjc6m-ejxqHuVh4JQuT5JcS2PmRa3Blrnfc_L9D3iG6rEYpc_DkqH1SQdYAG-K9ShUzH54WEw_-9PpouzEbbggzLzaxQPXiezdbjKUbgVmVbyE8b3yTwr1XEGMEhPKUFtTJnqgYCa97428IAhE" },
                            ].map((chefRec, idx) => (
                                <div key={idx} className="flex gap-4 items-center group cursor-pointer bg-background-light dark:bg-accent-dark p-2 rounded-xl hover:shadow-md transition-all">
                                    <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${chefRec.img}")` }}></div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <h4 className="text-text-main dark:text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{chefRec.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Home;
