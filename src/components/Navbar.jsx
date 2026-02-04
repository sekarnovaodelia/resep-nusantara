import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchDropdown from './SearchDropdown';
import SearchMobileModal from './SearchMobileModal';
import ConfirmationModal from './ConfirmationModal';

const Navbar = ({ darkMode, setDarkMode }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const profileRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    const { user, profile, loading, signOut } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const fetchUnread = async () => {
            if (user?.id) {
                const { supabase } = await import('../lib/supabaseClient');
                const { count } = await supabase
                    .from('notifications')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('is_read', false);

                if (isMounted && count !== null) {
                    setUnreadCount(count);
                }
            }
        };

        fetchUnread();

        // Optional: Polling every 30s
        const interval = setInterval(fetchUnread, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [user]);

    const closeSearch = () => {
        setIsSearchModalOpen(false);
        setIsMobileSearchOpen(false);
    };

    const handleSignOut = () => {
        setIsProfileOpen(false);
        setIsLogoutModalOpen(true);
    };

    const confirmSignOut = async () => {
        await signOut();
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }

            if (isSearchModalOpen || isMobileSearchOpen) {
                const isInsideDesktop = searchRef.current?.contains(event.target);
                const isToggleBtn = event.target.closest('.search-toggle-btn');

                if (!isInsideDesktop && !isToggleBtn) {
                    closeSearch();
                }
            }
        };

        const handleKeyboard = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchModalOpen(true);
                const input = document.querySelector('input[type="text"]');
                input?.focus();
            }
            if (e.key === 'Escape') {
                closeSearch();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleKeyboard);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyboard);
        };
    }, [isSearchModalOpen, isMobileSearchOpen, isProfileOpen]);

    const navLinkClass = ({ isActive }) =>
        `text-base transition-colors ${isActive
            ? 'text-primary font-bold'
            : 'font-semibold text-text-main dark:text-[#f3ece7] hover:text-primary'
        }`;

    // Use auth data or default
    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Pengguna';
    const username = profile?.username || user?.user_metadata?.username || 'user';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || (user ? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=EA6A12&color=fff' : null);

    const handleSearchNav = (query) => {
        if (!query.trim()) return;
        navigate(`/?search=${encodeURIComponent(query)}`);
        closeSearch();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchNav(searchQuery);
        }
    };

    return (
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark z-30 sticky top-0 transition-colors duration-200">
            {/* Logo and Nav */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                    </div>
                    <h1 className="text-text-main dark:text-white text-xl font-extrabold tracking-tight hidden sm:block">Resep Nusantara</h1>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6">
                    <NavLink className={navLinkClass} to="/">Home</NavLink>
                    <NavLink className={navLinkClass} to="/planner">Planner</NavLink>
                    <NavLink className={navLinkClass} to="/community">Community</NavLink>
                </nav>
            </div>

            {/* Main Search Bar (Desktop) */}
            <div className="flex-1 max-w-xl mx-4 sm:mx-8 hidden lg:flex relative" ref={searchRef}>
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white text-xl">search</span>
                    <input
                        className="w-full h-10 pl-10 pr-4 rounded-full bg-[#fcfaf8] dark:bg-accent-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary text-sm dark:text-white transition-all placeholder:text-gray-600 dark:placeholder:text-gray-300 search-dropdown-input"
                        placeholder="Cari resep, bahan..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchModalOpen(true)}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Desktop Dropdown attached to this container */}
                    <SearchDropdown
                        isOpen={isSearchModalOpen}
                        onClose={closeSearch}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearchNav}
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 relative ml-auto sm:ml-0">
                {/* Search Toggle Button (Mobile) */}
                <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className="search-toggle-btn p-3 rounded-full hover:bg-background-light dark:hover:bg-border-dark text-text-main dark:text-[#f3ece7] transition-all flex items-center justify-center lg:hidden"
                >
                    <span className="material-symbols-outlined">search</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-background-light dark:hover:bg-border-dark text-text-main dark:text-terracotta transition-all flex items-center justify-center"
                    title={darkMode ? "Ganti ke Terang" : "Ganti ke Gelap"}
                >
                    <span className="material-symbols-outlined">
                        {darkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                {/* Notifications */}
                <Link to="/notifications" className="hidden lg:flex p-2 rounded-full hover:bg-background-light dark:hover:bg-border-dark text-text-main dark:text-[#f3ece7] transition-all items-center justify-center relative group" title="Lihat Notifikasi">
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                        {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                    </span>
                    {unreadCount > 0 && (
                        <div className="absolute top-1 left-5 bg-primary text-white text-[10px] font-bold px-1 h-4 min-w-[16px] flex items-center justify-center rounded-full border-2 border-background-light dark:border-background-dark shadow-sm animate-in zoom-in duration-300">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </Link>

                {/* User Profile Thumbnail & Dropdown (Rightmost) */}
                {user ? (
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={`size-10 rounded-full border-2 transition-all p-0.5 ${isProfileOpen ? 'border-primary' : 'border-primary/20'}`}
                        >
                            <div className="size-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-[min(calc(100vw-2rem),20rem)] bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                {/* Dropdown Header */}
                                <div className="p-5 bg-accent/30 dark:bg-accent-dark/30 border-b border-border-light dark:border-border-dark flex items-center gap-4">
                                    <div className="size-14 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
                                        <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h4 className="font-extrabold text-text-main dark:text-white text-base leading-tight truncate">{displayName}</h4>
                                        <p className="text-xs text-text-secondary font-medium dark:text-gray-400 truncate">@{username}</p>
                                    </div>
                                </div>

                                {/* Menu Links */}
                                <div className="p-2">
                                    <Link to="/profile" className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-accent-dark rounded-xl transition-all group" onClick={() => setIsProfileOpen(false)}>
                                        <span className="material-symbols-outlined w-6 text-text-secondary dark:text-gray-400 group-hover:text-primary transition-colors text-center">person_outline</span>
                                        <span>Lihat Profil</span>
                                    </Link>
                                    <Link to="/upload-recipe" className="hidden lg:flex w-full items-center gap-4 px-4 py-3 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-accent-dark rounded-xl transition-all group" onClick={() => setIsProfileOpen(false)}>
                                        <span className="material-symbols-outlined w-6 text-text-secondary dark:text-gray-400 group-hover:text-primary transition-colors text-center">add_circle</span>
                                        <span>Upload Resep</span>
                                    </Link>

                                    {/* Admin Link */}
                                    {profile?.role === 'admin' && (
                                        <Link to="/admin" className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-accent-dark rounded-xl transition-all group" onClick={() => setIsProfileOpen(false)}>
                                            <span className="material-symbols-outlined w-6 text-text-secondary dark:text-gray-400 group-hover:text-primary transition-colors text-center">admin_panel_settings</span>
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Logout */}
                                <div className="p-2 border-t border-border-light dark:border-border-dark mt-1 bg-background-light/10 dark:bg-white/5">
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group">
                                        <span className="material-symbols-outlined w-6 transition-transform group-hover:translate-x-0.5 text-center">logout</span>
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">login</span>
                        <span className="hidden sm:inline">Masuk</span>
                    </Link>
                )}
            </div>

            {/* Mobile/Tablet Centered Search Modal */}
            <SearchMobileModal
                isOpen={isMobileSearchOpen}
                onClose={closeSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearchNav}
            />

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmSignOut}
                title="Keluar dari Akun?"
                message="Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk kembali untuk mengakses fitur personal."
                confirmText="Keluar"
                cancelText="Batal"
                isDanger={true}
            />
        </header>
    );
};

export default Navbar;

