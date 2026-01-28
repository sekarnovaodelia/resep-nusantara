import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useBookmarks } from '../context/BookmarkContext';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [myRecipes, setMyRecipes] = React.useState([]);
    const [bookmarkedRecipes, setBookmarkedRecipes] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('my_recipes'); // 'my_recipes' | 'collection'
    const [stats, setStats] = React.useState({ followers: 0, following: 0, recipes: 0 });
    const { user, profile, loading, signOut } = useAuth();
    const { fetchProfileStats } = useSocial();
    const { bookmarkedRecipeIds } = useBookmarks();
    const navigate = useNavigate();

    // Prevent duplicate fetchProfileStats calls (Strict Mode guard)
    const lastFetchedUserIdRef = React.useRef(null);
    const isFetchingStatsRef = React.useRef(false);

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Fetch user's recipes & stats (consolidated)
    React.useEffect(() => {
        const loadData = async () => {
            if (user?.id) {
                // Guard: Don't refetch if already fetching or already fetched for this user
                if (isFetchingStatsRef.current || lastFetchedUserIdRef.current === user.id) {
                    return;
                }

                isFetchingStatsRef.current = true;
                lastFetchedUserIdRef.current = user.id;

                try {
                    const { fetchRecipes } = await import('../lib/recipeService');

                    // 1. Fetch Recipes
                    const myRecs = await fetchRecipes({ userId: user.id });
                    setMyRecipes(myRecs);

                    // 2. Fetch consolidated stats (single request instead of 3 HEAD requests)
                    const profileStats = await fetchProfileStats(user.id);
                    setStats({
                        ...profileStats,
                        recipes: myRecs.length
                    });

                    // 3. Load bookmarks if tab is collection (use cached context instead of re-fetching)
                    if (activeTab === 'collection') {
                        // Get recipes that are bookmarked from cached IDs
                        const bookmarked = myRecs.filter(recipe => bookmarkedRecipeIds.has(recipe.id));
                        setBookmarkedRecipes(bookmarked);
                    }
                } catch (error) {
                    console.error('Error loading profile data:', error);
                } finally {
                    isFetchingStatsRef.current = false;
                }
            }
        };
        loadData();
    }, [user, activeTab, fetchProfileStats, bookmarkedRecipeIds]);



    if (loading) {
        return (
            <div className="layout-container flex justify-center items-center py-8 px-4 flex-1 min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-sub dark:text-gray-400">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Use profile data or fallback to user metadata
    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Pengguna';
    const username = profile?.username || user?.user_metadata?.username || 'user';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=EA6A12&color=fff';

    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                <main className="flex-1 flex flex-col gap-6 min-w-0 w-full">
                    {/* Profile Header Card */}
                    <div className="rounded-xl p-4 md:p-6 bg-card-light dark:bg-card-dark shadow-sm border border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex flex-row gap-4 md:gap-8 items-center">
                            {/* Avatar */}
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-20 md:size-32 shrink-0 border-2 md:border-4 border-[#f8f7f6] dark:border-[#221810]" data-alt={`Foto profil ${displayName}`} style={{ backgroundImage: `url("${avatarUrl}")` }}></div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0 justify-center">
                                <div className="flex items-center justify-between gap-2">
                                    <h1 className="text-text-main dark:text-white text-2xl md:text-4xl font-black tracking-tight truncate pr-2">{displayName}</h1>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="p-2 text-text-sub hover:text-primary bg-background-light dark:bg-white/5 md:bg-transparent rounded-full md:rounded-lg transition-colors shrink-0"
                                        title="Edit Profil"
                                    >
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">edit</span>
                                    </button>
                                </div>
                                <p className="text-text-sub dark:text-gray-400 text-sm md:text-base font-medium leading-relaxed truncate">
                                    @{username}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-6 pt-0 md:pt-6 md:border-t border-[#e7d9cf] dark:border-[#3a2e25] justify-around md:justify-start">
                            <div className="flex flex-col items-center md:items-start gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-lg md:text-xl font-bold">{stats.followers}</p>
                                <p className="text-text-sub dark:text-gray-500 text-xs md:text-sm">Pengikut</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden md:block"></div>
                            <div className="flex flex-col items-center md:items-start gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-lg md:text-xl font-bold">{stats.following}</p>
                                <p className="text-text-sub dark:text-gray-500 text-xs md:text-sm">Mengikuti</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden md:block"></div>
                            <div className="flex flex-col items-center md:items-start gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-lg md:text-xl font-bold">{stats.recipes}</p>
                                <p className="text-text-sub dark:text-gray-500 text-xs md:text-sm">Resep</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-[#e7d9cf] dark:border-[#3a2e25] sticky top-[64px] bg-background-light dark:bg-background-dark z-20 transition-all duration-300">
                        <div className="flex gap-0 w-full">
                            <button
                                onClick={() => setActiveTab('my_recipes')}
                                className="group relative py-4 flex-1 text-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <span className={`text-sm font-bold transition-colors ${activeTab === 'my_recipes' ? 'text-primary' : 'text-text-sub dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200'}`}>
                                    Resep Saya
                                </span>
                                {activeTab === 'my_recipes' && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('collection')}
                                className="group relative py-4 flex-1 text-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <span className={`text-sm font-bold transition-colors ${activeTab === 'collection' ? 'text-primary' : 'text-text-sub dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200'}`}>
                                    Koleksi
                                </span>
                                {activeTab === 'collection' && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {(activeTab === 'my_recipes' ? myRecipes : bookmarkedRecipes).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-0.5">
                            {(activeTab === 'my_recipes' ? myRecipes : bookmarkedRecipes).map((recipe) => (
                                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="group flex flex-col gap-2 cursor-pointer">
                                    <div className="w-full overflow-hidden rounded-xl aspect-square relative shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/400x400'}")` }}></div>
                                        {recipe.regions?.name && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-white/90 dark:bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-text-main dark:text-white shadow-sm">{recipe.regions.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-1">
                                        <h3 className="text-text-main dark:text-white text-sm md:text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{recipe.title}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[14px] text-yellow-500">star</span>
                                            <span className="text-xs font-medium text-text-sub dark:text-gray-400">4.8</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-300 dark:text-gray-600 mb-4">
                                {activeTab === 'my_recipes' ? 'restaurant_menu' : 'bookmark_border'}
                            </span>
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
                                {activeTab === 'my_recipes' ? 'Belum Ada Resep' : 'Koleksi Kosong'}
                            </h3>
                            <p className="text-text-sub dark:text-gray-400 mb-6 max-w-md text-sm md:text-base px-4">
                                {activeTab === 'my_recipes'
                                    ? 'Anda belum mengunggah resep apapun. Mulai bagikan resep favorit Anda!'
                                    : 'Simpan resep favorit Anda di sini untuk akses cepat.'}
                            </p>
                            {activeTab === 'my_recipes' ? (
                                <Link
                                    to="/upload-recipe"
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors text-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    Unggah Resep
                                </Link>
                            ) : (
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-text-main rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Jelajah Resep
                                </Link>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default Profile;
