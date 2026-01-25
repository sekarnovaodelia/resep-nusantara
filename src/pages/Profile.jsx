import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const { user, profile, loading, signOut } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

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
    const location = profile?.location || 'Indonesia';

    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                <main className="flex-1 flex flex-col gap-6 min-w-0 w-full">
                    {/* Profile Header Card */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-24 md:size-32 shrink-0 border-4 border-[#f8f7f6] dark:border-[#221810]" data-alt={`Foto profil ${displayName}`} style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">{displayName}</h1>
                                </div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                                    @{username}
                                </p>
                                <div className="flex items-center gap-1 text-text-sub dark:text-gray-500 text-sm mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {location}
                                </div>
                            </div>
                            <div className="flex md:flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-2 text-text-sub hover:text-primary hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors"
                                    title="Edit Profil"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-text-sub hover:text-red-500 hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors"
                                    title="Keluar"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#e7d9cf] dark:border-[#3a2e25]">
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">0</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Pengikut</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">0</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Mengikuti</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">0</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Resep</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar justify-start">
                            <button className="group relative pb-3 px-4">
                                <span className="text-primary font-bold text-sm">Resep Saya</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            </button>
                            <button className="group relative pb-3 px-4">
                                <span className="text-text-sub dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-gray-200 font-medium text-sm transition-colors">Koleksi</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-[#e7d9cf] rounded-t-full transition-colors"></span>
                            </button>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">restaurant_menu</span>
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Belum Ada Resep</h3>
                        <p className="text-text-sub dark:text-gray-400 mb-6 max-w-md">
                            Anda belum mengunggah resep apapun. Mulai bagikan resep favorit Anda!
                        </p>
                        <Link
                            to="/upload-recipe"
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Unggah Resep
                        </Link>
                    </div>
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
