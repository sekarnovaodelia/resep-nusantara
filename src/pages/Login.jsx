import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getOptimizedImageUrl, preloadImages } from '../utils/imageOptimizer';

const Login = () => {
    const splashImage = 'https://images.unsplash.com/photo-1680173073730-852e0ec93bec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // Preload important images for home page
    const preloadHomeAssets = () => {
        preloadImages([
            'https://weghbluslrzbkrzfuofu.supabase.co/storage/v1/object/public/recipes/main/1770187319968_jeb9z.jpg', // Hero image
            'https://weghbluslrzbkrzfuofu.supabase.co/storage/v1/object/public/recipes/main/1770273093607_zeezun.jfif' // Recommendation
        ]);
    };
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('🔵 Login started');
        setLoading(true);
        setError('');

        try {
            // Convert username to temporary email format
            const tempEmail = `${username}@resepnusantara.local`;
            console.log('🔵 Temp email:', tempEmail);

            console.log('🔵 Calling supabase.auth.signInWithPassword...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email: tempEmail,
                password: password,
            });

            console.log('🔵 Login response:', { data, error });

            if (error) throw error;

            console.log('🔵 Login successful, navigating to /');
            preloadHomeAssets(); // Start preloading home assets immediately
            // Navigate to home page on successful login
            navigate('/');
        } catch (error) {
            console.error('🔴 Login error:', error);
            setError(error.message || 'Terjadi kesalahan saat login');
        } finally {
            console.log('🔵 Login finally block, setting loading to false');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display transition-colors duration-200">
            {/* Left Column: Atmospheric Image */}
            {/* Hidden on mobile/tablet, visible on desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ease-in-out hover:scale-105"
                    style={{ backgroundImage: `url('${getOptimizedImageUrl(splashImage, { width: 800 })}')` }}
                >
                </div>
                {/* Overlay for atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#221810]/90 via-[#221810]/40 to-transparent"></div>
                <div className="relative z-10 p-16 w-full max-w-xl self-end mb-20 animate-fade-in-up">
                    <div className="w-16 h-1 bg-primary mb-6 rounded-full shadow-lg shadow-orange-500/30"></div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        Temukan Cita Rasa <br />Warisan Leluhur
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed drop-shadow-sm font-medium">
                        Bergabunglah dengan komunitas kuliner terbesar dan bagikan resep otentik dari dapur Anda.
                    </p>
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-20 xl:px-24 bg-background-light dark:bg-background-dark relative">
                {/* Mobile Background Pattern (Optional subtle texture) */}
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none animate-pulse-slow">
                    <span className="material-symbols-outlined text-9xl text-primary">skillet</span>
                </div>
                <div className="w-full max-w-[440px] flex flex-col gap-8 z-10 animate-fade-in">
                    {/* Brand & Header */}
                    <div className="flex flex-col gap-3 group">
                        <Link to="/" className="flex items-center gap-2 mb-2 text-primary w-fit hover:opacity-80 transition-all hover:-translate-x-1">
                            <span className="material-symbols-outlined filled text-3xl transition-transform group-hover:rotate-12">restaurant_menu</span>
                            <span className="text-lg font-bold tracking-tight text-text-main-light dark:text-text-main-dark">Resep Nusantara</span>
                        </Link>
                        <h1 className="text-text-main-light dark:text-text-main-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-text-sub-light dark:text-text-sub-dark text-base font-normal leading-normal">
                            Masuk untuk mulai menjelajahi rasa nusantara.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form Fields */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main-light dark:text-text-main-dark text-sm font-bold leading-normal ml-1" htmlFor="username">
                                Username
                            </label>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-text-sub-light dark:text-text-sub-dark transition-colors group-focus-within:text-primary z-10">person</span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/70 dark:placeholder:text-text-sub-dark/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all duration-200 hover:border-primary/50 focus:border-primary group-hover:shadow-sm"
                                    id="username"
                                    placeholder="Masukkan username Anda"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-text-main-light dark:text-text-main-dark text-sm font-bold leading-normal" htmlFor="password">
                                    Kata Sandi
                                </label>
                            </div>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-text-sub-light dark:text-text-sub-dark transition-colors group-focus-within:text-primary z-10">lock</span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/70 dark:placeholder:text-text-sub-dark/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 pl-12 pr-12 text-base font-normal leading-normal transition-all duration-200 hover:border-primary/50 focus:border-primary group-hover:shadow-sm"
                                    id="password"
                                    placeholder="Masukkan kata sandi"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-4 text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors flex items-center justify-center focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#3e3228]"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Primary Action */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-[#d55f0e] active:bg-[#bd520a] active:scale-[0.98] text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{loading ? 'Memproses...' : 'Masuk'}</span>
                        </button>
                    </form>

                    {/* Footer CTA */}
                    <div className="text-center pt-2">
                        <p className="text-text-main-light dark:text-text-main-dark text-sm">
                            Belum punya akun?
                            <Link className="text-primary font-bold hover:underline hover:text-orange-700 transition-colors ml-1" to="/register">Daftar Sekarang</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Rights */}
                <div className="absolute bottom-6 text-xs text-text-sub-light dark:text-text-sub-dark/50 hidden lg:block hover:text-text-sub-light transition-colors cursor-default">
                    © 2024 Resep Nusantara. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;

