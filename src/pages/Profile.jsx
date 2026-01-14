import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                <main className="flex-1 flex flex-col gap-6 min-w-0 w-full">
                    {/* Profile Header Card */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-24 md:size-32 shrink-0 border-4 border-[#f8f7f6] dark:border-[#221810]" data-alt="Portrait of Chef Budi" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALm9SaB074MMWFc5lPj87OCVunpllCVYpf_Ed-ZiOMC8Zb3Eqz6s4geKHvPlNnL8S3KJK6MugN2qmaxUR2IvKabz_7EZosU3Y7fibGG1D7o_VT4aoF4H-4pmRW2MyIdu1Zv8pQE5_Sj3V6Oisdp0T-eMi0sn1FbcDxMeNMPKrlZdkvJMLhRiWQYZcLqlHm2xQSiGk2NvqyAQo2I67EakG2y6eVrOVYpAd4YMKTHrGBF-Ucgttrxg4BPzKlm0TwPsAiyfFI2kbrioQ6")' }}></div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">Budi Santoso</h1>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                                        <span className="material-symbols-outlined text-[16px] fill">verified</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Verified Cook</span>
                                    </div>
                                </div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                                    Enthusiastic home chef exploring authentic flavors of Indonesia one dish at a time. Lover of spicy sambal and slow-cooked rendang.
                                </p>
                                <div className="flex items-center gap-1 text-text-sub dark:text-gray-500 text-sm mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    Jakarta, Indonesia
                                </div>
                            </div>
                            <div className="flex md:flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-2 text-text-sub hover:text-primary hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors"
                                    title="Settings"
                                >
                                    <span className="material-symbols-outlined">settings</span>
                                </button>
                                <button className="p-2 text-text-sub hover:text-primary hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors" title="Share Profile">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#e7d9cf] dark:border-[#3a2e25]">
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">1.2k</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Pengikut</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">45</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Mengikuti</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">32</p>
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

                    {/* Recipe Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                        {/* Recipe Card 1 */}
                        <div className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtJard2XPE0cYM-n7tIBGmfmqjLMhLENPi4kc7igQqjMTaCqVMlyqzumE8Wl4hi4bVL6nwYE0X9wh-eSKCZ5Gtjv3sx1OqwIe-dqPWmx8iOY1BCuTySWYWw-3icsby7amcw4W-C96oFuX5IQr4LsUAR12rFdQ8nKfcgCc5R0fjlhbQzgNvGCvn3JqhLUbXgzWISFnTpQ9BsM_QjaSlvuiYkTi0NhvwLHLqqfm4E78_rDSIBS8ECwtzmdB_kSQFMcNhIn3rJ6PPNvdH")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Nasi Goreng Kampung Spesial</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        20 min
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                        Mudah
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">124</span></span>
                                    </div>
                                    <button className="text-text-sub hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Card 2 */}
                        <div className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8R2sFPGpXWPbu0OfLxA2xA3DKo6duzUkgNxoP0XmRmb4CZ78l1Yg9Yt3CpYcfZfE2WUVj07IFmWdb95AoJAnCcl6Np0bVijO32yJ3Tfrx8px_UI7ya0-AIV67W3k5lRoUQ_x-UAFqtqhrOa4Yf_PIzWTO6IZAZ08LnkDNVYxRZRxOMLvReSejLOVCKbhoO3x2V9ke1ndz8zZ72lIWCbTaxUjjvKF28bNEuX_3C4jLxwEANgpTvCjrJPvvb5GvFrfhouf4YyzVvqoS")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Soto Ayam Lamongan</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        45 min
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                        Sedang
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">89</span></span>
                                    </div>
                                    <button className="text-text-sub hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Card 3 */}
                        <div className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Draft</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAL_1zpekfazA3blDHm7pawWs6vBrnOAaV9KZNPrsORQ5EmILYYLtO30TyK0sdwTVvqy1PUngJ37OMC4Bt7cJkuIAoiafTG_zGCBTnDHfqGE62L5Smj2-umF_t2NxGJy-Fu2E3U7RgERBz6n6MKygiF8ynsErKh8Jw-gpPG-N_WAwnBsJUuFuF7Ge0_4zU7mINpI9mQ37MYUzTveNjBwTFRqJYrgmM08GlwS8t6Sf1qPi308DknDZeQbMTmWfmePHUsJwiqJ1VD6TT")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Rendang Daging Sapi (Recipe in Progress)</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        3 hr
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                        Sulit
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub italic">Last edited: 2h ago</span>
                                    </div>
                                    <button className="text-text-sub hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Card 4 */}
                        <div className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDoXyOLGS3KiGm8nGLHcjBweO0v-4flh8p6IOf2qF6vUmnN9KgZ53U7mmwkDHNUCGtg0s1g4LQbwahboSM_4AYyh5TaLUMr65weB-O304qCXjOKijS1NkZgJzW10m5A9PyCNpAkP1d40F50xC2TNSjgkDkR-BD-d4xXKoq6OAbSIHlJwem9H83D_Fd5RB_jy2GjB9fftQlcIczYk3mxlF7yK8RP2Yj6MM3cB20AGeWglRkwI4dbCoU5WNgPxH6v2mMQuuZc0jVqmcN")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Martabak Manis Coklat Keju</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        30 min
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                        Mudah
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">215</span></span>
                                    </div>
                                    <button className="text-text-sub hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                        </div>
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
