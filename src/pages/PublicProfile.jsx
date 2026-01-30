import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { toggleFollow, checkFollowStatus } from '../lib/interactionService';

const PublicProfile = () => {
    const [searchParams] = useSearchParams();
    const profileId = searchParams.get('id');
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isFollowing, updateFollowingStatus, fetchProfileStats } = useSocial();

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ followers: 0, following: 0, recipes: 0 });
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userIsFollowing, setUserIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Prevent duplicate fetchProfileStats calls
    const lastFetchedProfileIdRef = React.useRef(null);
    const isFetchingStatsRef = React.useRef(false);

    useEffect(() => {
        if (!profileId) {
            return;
        }

        const fetchProfileData = async () => {
            // Guard: Don't refetch if already fetching or already fetched for this profile
            if (isFetchingStatsRef.current || lastFetchedProfileIdRef.current === profileId) {
                return;
            }

            isFetchingStatsRef.current = true;
            lastFetchedProfileIdRef.current = profileId;

            setLoading(true);
            try {
                // 1. Fetch Profile Info
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', profileId)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // 2. Fetch consolidated stats (single request instead of 3 HEAD requests)
                const profileStats = await fetchProfileStats(profileId);
                setStats(profileStats);

                // 3. Fetch Recipes
                const { data: recipesData, error: recipesError } = await supabase
                    .from('recipes')
                    .select(`
                        *,
                        regions(name)
                    `)
                    .eq('user_id', profileId)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (recipesError) {
                    console.error('Error fetching public recipes:', recipesError);
                }

                setRecipes(recipesData || []);

                // 4. Check Follow Status
                if (user && user.id !== profileId) {
                    const status = isFollowing(profileId);
                    setUserIsFollowing(status);
                }

            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
                isFetchingStatsRef.current = false;
            }
        };

        fetchProfileData();
    }, [profileId, user, isFollowing, fetchProfileStats]);

    const handleFollowToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.id === profileId) return; // Cannot follow self

        setFollowLoading(true);
        try {
            const newStatus = await toggleFollow(user.id, profileId);
            setUserIsFollowing(newStatus);
            
            // Update global social context
            updateFollowingStatus(profileId, newStatus);

            // Optimistic update of stats
            setStats(prev => ({
                ...prev,
                followers: newStatus ? prev.followers + 1 : Math.max(0, prev.followers - 1)
            }));
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 min-h-screen">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">person_off</span>
                <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Pengguna Tidak Ditemukan</h2>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold">
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=random`;

    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                <main className="flex-1 flex flex-col gap-6 min-w-0 w-full">

                    {/* Profile Header Card */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-24 md:size-32 shrink-0 border-4 border-[#f8f7f6] dark:border-[#221810]"
                                style={{ backgroundImage: `url("${avatarUrl}")` }}>
                            </div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">
                                        {profile.full_name || profile.username || 'Pengguna'}
                                    </h1>
                                    {/* Verification Badge (Static for now, logic can be added later) */}
                                    {/* <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                                        <span className="material-symbols-outlined text-[16px] fill">verified</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Verified Cook</span>
                                    </div> */}
                                </div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                                    {profile.bio || 'Belum ada bio.'}
                                </p>
                                <div className="flex items-center gap-1 text-text-sub dark:text-gray-500 text-sm mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {profile.location || 'Indonesia'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 shrink-0">
                                {user?.id !== profileId && (
                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm whitespace-nowrap min-w-[100px] flex justify-center items-center ${userIsFollowing
                                            ? 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                            }`}
                                    >
                                        {followLoading ? (
                                            <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            userIsFollowing ? 'Mengikuti' : 'Ikuti'
                                        )}
                                    </button>
                                )}

                                <button
                                    className="p-2 text-text-sub hover:text-primary hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
                                    title="Share Profile"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        // Could add a toast here
                                        alert('Link profil disalin!');
                                    }}
                                >
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#e7d9cf] dark:border-[#3a2e25]">
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">{stats.followers}</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Pengikut</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">{stats.following}</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Mengikuti</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">{stats.recipes}</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Resep</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar justify-start">
                            <button className="group relative pb-3 px-4">
                                <span className="text-primary font-bold text-sm">Resep Publik</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            </button>
                        </div>
                    </div>

                    {/* Recipe Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                        {recipes.length === 0 ? (
                            <div className="col-span-full py-10 text-center">
                                <p className="text-text-secondary">Belum ada resep yang dipublikasikan.</p>
                            </div>
                        ) : (
                            recipes.map((recipe) => (
                                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                        </div>
                                        <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/600x400'}")` }}></div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">timer</span>
                                                {recipe.cook_time || '-'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                                {recipe.difficulty || 'Sedang'}
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                            <div className="flex gap-2">
                                                {/* Placeholder likes for now, or join if available */}
                                                <span className="text-xs text-text-sub">Lihat Detail</span>
                                            </div>
                                            <button className="text-text-sub hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PublicProfile;
