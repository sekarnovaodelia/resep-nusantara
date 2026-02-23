import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log('🔵 Register started');
        setLoading(true);
        setError('');

        try {
            // Create a temporary email from username for Supabase auth
            const tempEmail = `${username}@resepnusantara.local`;
            console.log('🔵 Temp email:', tempEmail);

            console.log('🔵 Calling supabase.auth.signUp...');
            const { data, error } = await supabase.auth.signUp({
                email: tempEmail,
                password: password,
                options: {
                    data: {
                        username: username,
                        full_name: fullName,
                        location: location,
                    },
                },
            });

            console.log('🔵 SignUp response:', { data, error });

            if (error) throw error;

            console.log('🔵 Registration successful, showing alert');
            // Show success message and navigate to login
            alert('Pendaftaran berhasil! Silakan login dengan username Anda.');
            console.log('🔵 Navigating to /login');
            navigate('/login');
        } catch (error) {
            console.error('🔴 Register error:', error);
            if (error?.code === '23505' || error?.message?.includes('already registered')) {
                // duplicate key value violates unique constraint or user already exists
                alert("Username sudah dipakai");
                setError("Username sudah dipakai");
            } else {
                setError(error.message || 'Terjadi kesalahan saat mendaftar');
            }
        } finally {
            console.log('🔵 Register finally block, setting loading to false');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display transition-colors duration-200">
            {/* Left Column: Atmospheric Image */}
            {/* Hidden on mobile/tablet, visible on desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center overflow-hidden">
                <img
            src="https://weghbluslrzbkrzfuofu.supabase.co/storage/v1/object/public/hero/register.webp"
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105"
            loading="eager"
            decoding="async"
            fetchpriority="high"
                />
                {/* Overlay for atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#221810]/90 via-[#221810]/40 to-transparent"></div>
                <div className="relative z-10 p-16 w-full max-w-xl self-end mb-20 animate-fade-in-up">
                    <div className="w-16 h-1 bg-primary mb-6 rounded-full shadow-lg shadow-orange-500/30"></div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        Mulai Petualangan <br />Kuliner Anda
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed drop-shadow-sm font-medium">
                        Temukan inspirasi memasak tak terbatas dan simpan resep favorit nusantara Anda di satu tempat.
                    </p>
                </div>
            </div>

            {/* Right Column: Register Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-start lg:justify-center items-center px-6 pt-16 pb-8 lg:py-12 lg:px-20 xl:px-24 bg-background-light dark:bg-background-dark relative">
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
                            Buat Akun Baru
                        </h1>
                        <p className="text-text-sub-light dark:text-text-sub-dark text-base font-normal leading-normal">
                            Daftar sekarang untuk bergabung dengan komunitas kami.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form Fields */}
                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main-light dark:text-text-main-dark text-sm font-bold leading-normal ml-1" htmlFor="fullname">
                                Nama Lengkap
                            </label>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-text-sub-light dark:text-text-sub-dark transition-colors group-focus-within:text-primary z-10">person</span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/70 dark:placeholder:text-text-sub-dark/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all duration-200 hover:border-primary/50 focus:border-primary group-hover:shadow-sm"
                                    id="fullname"
                                    placeholder="Masukkan nama lengkap Anda"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                                    placeholder="Pilih username unik Anda"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    required
                                    minLength={3}
                                    maxLength={20}
                                />
                            </div>
                            <p className="text-xs text-text-secondary dark:text-gray-400 ml-1">Username hanya boleh huruf kecil, angka, dan underscore</p>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main-light dark:text-text-main-dark text-sm font-bold leading-normal ml-1" htmlFor="location">
                                Lokasi
                            </label>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-text-sub-light dark:text-text-sub-dark transition-colors group-focus-within:text-primary z-10">location_on</span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/70 dark:placeholder:text-text-sub-dark/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all duration-200 hover:border-primary/50 focus:border-primary group-hover:shadow-sm"
                                    id="location"
                                    placeholder="Contoh: Jakarta, Indonesia"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
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
                                    placeholder="Buat kata sandi minimal 8 karakter"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
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
                            <span className="truncate">{loading ? 'Memproses...' : 'Daftar Sekarang'}</span>
                        </button>
                    </form>

                    {/* Footer CTA */}
                    <div className="text-center pt-2">
                        <p className="text-text-main-light dark:text-text-main-dark text-sm">
                            Sudah punya akun?
                            <Link className="text-primary font-bold hover:underline hover:text-orange-700 transition-colors ml-1" to="/login">Masuk</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Rights */}
                <div className="absolute bottom-6 text-xs text-text-sub-light dark:text-text-sub-dark/50 hidden lg:block hover:text-text-sub-light transition-colors cursor-default">
                    © 2026 Resep Nusantara. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Register;
