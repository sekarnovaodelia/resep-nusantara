import React from 'react';
import { Link } from 'react-router-dom';

const PublicProfile = () => {
    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                <main className="flex-1 flex flex-col gap-6 min-w-0 w-full">

                    {/* Profile Header Card */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-[#e7d9cf] dark:border-[#3a2e25]">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-24 md:size-32 shrink-0 border-4 border-[#f8f7f6] dark:border-[#221810]" data-alt="Portrait of Chef Siti" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAR2UD2otjTNsOumsXSuvvdAuQ4ar6ijPCxm9e6KW_gqrRB6-kIAuDEFmErWJGhN1QmBJocpZpjVZcTEKrqF8QE9Q3_iuhkEF4ovUeMdrew3zFbrKX1WRT9-a1RPx497VWLlpWx1kqBMCFWhSiJJoi8gZ_YxVMU7aGbxOMKcTocSL82iWcY61ckqVaeNmbdTYiPLxhZSCnjXfz6wTL-56rvk3MDKXbVw9L3ST4SrFHq_m5mmC9cs-b4Fhx5gQg8ImW1DMVJr3g4soPr")' }}></div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">Chef Siti</h1>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                                        <span className="material-symbols-outlined text-[16px] fill">verified</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Verified Cook</span>
                                    </div>
                                </div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                                    Berbagi cita rasa masakan Jawa otentik ke seluruh dunia. Mencintai rempah-rempah dan tradisi kuliner Nusantara. 🌶️🍲
                                </p>
                                <div className="flex items-center gap-1 text-text-sub dark:text-gray-500 text-sm mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    Yogyakarta, Indonesia
                                </div>
                            </div>
                            <div className="flex md:flex-col gap-2 shrink-0">
                                <button
                                    className="px-6 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap"
                                >
                                    Ikuti
                                </button>
                                <button className="p-2 text-text-sub hover:text-primary hover:bg-background-light dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center" title="Share Profile">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#e7d9cf] dark:border-[#3a2e25]">
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">2.4k</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Pengikut</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">120</p>
                                <p className="text-text-sub dark:text-gray-500 text-sm">Mengikuti</p>
                            </div>
                            <div className="w-px bg-[#e7d9cf] dark:bg-[#3a2e25] h-10 mx-2 hidden sm:block"></div>
                            <div className="flex flex-col gap-0.5 px-2">
                                <p className="text-text-main dark:text-white text-xl font-bold">45</p>
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
                        {/* Recipe Card 1 */}
                        <div className="group bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e7d9cf] dark:border-[#3a2e25] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdcK4aArfZYlK43HinPvX0mCTSaA2E3nSaa-ZVgHskqwRmRZpWi27J6nYiavZycIHEoTFPDBk0kvruxsqsnu80FhEukY2l2opWlNvQLPWbqy03nSwQrh07s6KrhSeDgEDms0mSo_VuJoy8aME4jXnZWoRQTezx88CYt3lHzW-beT-1lHUILTsjr5sKirkcY9HVpTFDhoPFs1EA2w1AWMJTac3sQRrAZ59lvGYSbE66JcmlcMcba8QR4mZXZTmjF3sOlNMrHfYUHVSI")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Sate Ayam Madura</h3>
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
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">450</span></span>
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
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuxLdMGs8Oe0JkTTkM5oWrQAW3nj4gw4fGdVRAzhK0v3fY5m-8jw2p9FqZaJyUt8kyaWmZK-0OYgjJUEv28yhPhECmp-jS0s8OTXYawiwrbk9fQjQpgJ5ArLqGs9qIaeLU3XmC5NZu5uYFlso3swlLfODmgVUqxMNRkQm4X_ipqor9C7u_Ym8XXYgpghWm4pbwc_eoBRCMSYPJsmSTE_oYgv89hOlYGZ2vKWTZVVbtG4tCgmZsBVV_72_TEkFGu1kaXk5SEq5NbjrM")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Nasi Goreng Kampung</h3>
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
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">1.2k</span></span>
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
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Published</span>
                                </div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1A6ZuSopEuc_xR1oBwsoqpR6TmugZBCpK_fzQ-8wQ8GZS-GwN2CmePugaNHpzD_TcAYzGCZ4-Bqas8JLNzkXSmtbqNTxYY_jqHXgRzXi-tHIHkz9ztANl5tUFdehwSyFITPlLTHlT6hriXXU_mtykTUIXQe_6qZ3o-OKnFx5Bpdt1USQ53KHbWDsSHOiTROAPhemEOO4YB0Jx61lwQuIG9AWkMwwiF3I0RZQ44mRnQFBuh6CexLkjlJiAQC6XOpeS8eC8S5nHwLgf")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Rendang Daging Sapi</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        4 hr
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                                        Sulit
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">3.4k</span></span>
                                    </div>
                                    <button className="text-text-sub hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
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
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaH_kHuZVPnIm85c7lEVrAAcxexCSx_J7SXNSZPPelWLRHqiOoYldpZ0gXqXofR8oBLhpK21ksJECsR9pn287acUWDfttMmbWvQewnctTECKb19aTFZZJNY3ORjpq1qsynXrVZYY3UCojZnx13cZclhU3lHJheOR_5c6gUlye45E0uDN4_Mfcfgdqs_4VtYIvDIeFqTaWS1e2132jOq2HQwiBLqYQ8UOM-CZP--pOe6jOKm1NPjJZLQiNO-sA1kEGL-nC6B0IveyWE")' }}></div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-text-main dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">Gado-Gado Jakarta</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-sub dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">timer</span>
                                        30 mnt
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                        Mudah
                                    </div>
                                </div>
                                <div className="mt-2 pt-3 border-t border-[#f3ece7] dark:border-[#3a2e25] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs text-text-sub">Likes: <span className="font-bold text-text-main dark:text-white">890</span></span>
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
        </div>
    );
};

export default PublicProfile;
