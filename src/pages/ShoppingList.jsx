import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShoppingList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get mode from navigation state, default to 'daily' if not present
    const mode = location.state?.mode || 'daily';
    const title = mode === 'weekly' ? 'Daftar Belanja Mingguan' : 'Daftar Belanja Harian';
    const dateRange = mode === 'weekly' ? '23 - 29 Oktober 2023' : 'Senin, 23 Oktober 2023';

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-[#1b130d] dark:text-[#f3ece7] font-display">
            {/* Header / Sub-Header */}
            <div className="relative p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-surface-dark border-b border-gray-300 dark:border-gray-700">

                {/* Title & Info Block */}
                <div className="flex flex-row justify-between items-start w-full md:w-auto md:flex-col md:justify-center md:gap-1">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl md:text-2xl font-extrabold text-[#1b130d] dark:text-white leading-tight">
                            {title}
                        </h2>
                        <p className="text-xs md:text-sm text-[#9a6c4c] flex items-center gap-1.5 font-medium">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {dateRange}
                        </p>
                    </div>

                    {/* Share Button Top Right (Mobile Only) */}
                    <button className="md:hidden text-[#1b130d] dark:text-white hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10" title="Bagikan">
                        <span className="material-symbols-outlined text-xl">ios_share</span>
                    </button>
                </div>

                {/* Actions Block - Stacked below on mobile */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {/* Share Button (Desktop Only) */}
                    <button className="hidden md:flex justify-center p-2.5 bg-gray-100 dark:bg-[#342a22] text-[#1b130d] dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-[#4a3e36] transition-colors items-center" title="Bagikan">
                        <span className="material-symbols-outlined text-xl">ios_share</span>
                    </button>

                    <button
                        onClick={() => navigate('/planner')}
                        className="flex-1 md:flex-none justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-[#1b130d] dark:text-white hover:bg-background-light dark:hover:bg-[#342a22] transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>Kembali</span>
                    </button>
                    <button className="flex-1 md:flex-none justify-center px-6 py-2.5 bg-primary text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 shadow-sm transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span>Selesai</span>
                    </button>
                </div>
            </div>



            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
                <div className="space-y-6 md:space-y-8">
                    {/* Fresh Produce Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 md:px-6 md:py-4 bg-green-50/50 dark:bg-green-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-700 dark:text-green-400">
                                    <span className="material-symbols-outlined text-lg md:text-2xl">eco</span>
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-[#1b130d] dark:text-white">Bahan Segar</h3>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-300 dark:border-gray-700">8 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Bawang Merah & Putih', detail: 'Masing-masing 250g', usage: 'Mon Dinner, Wed Lunch' },
                                { name: 'Timun & Tomat', detail: '500g mix', usage: 'Tue Lunch (Gado-Gado)' },
                                { name: 'Cabai Rawit', detail: 'Pak 100g', usage: 'Mon Dinner, Fri Lunch' },
                                { name: 'Kangkung', detail: '2 ikat', usage: 'Thu Lunch' }
                            ].map((item) => (
                                <div key={item.name} className="p-3 md:p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-3 md:gap-4 group">
                                    <input className="mt-0.5 md:mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-4 h-4 md:w-5 md:h-5 cursor-pointer shrink-0" type="checkbox" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1b130d] dark:text-white text-sm md:text-base truncate">{item.name}</p>
                                                <p className="text-xs md:text-sm text-primary font-medium truncate">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
                                                <span className="material-symbols-outlined text-[10px] md:text-sm">restaurant</span>
                                                <span className="truncate max-w-[150px] sm:max-w-none">Digunakan di: <span className="font-semibold">{item.usage}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Protein & Pantry Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 md:px-6 md:py-4 bg-orange-50/50 dark:bg-orange-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-700 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-lg md:text-2xl">egg_alt</span>
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-[#1b130d] dark:text-white">Protein & Bahan Kering</h3>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-300 dark:border-gray-700">5 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Dada Ayam', detail: '1.5kg, iris/sate', usage: 'Mon Dinner (Sate), Wed Lunch (Soto)' },
                                { name: 'Beras Jasmine', detail: 'Kantong 5kg', usage: 'Staple sepanjang minggu' },
                                { name: 'Tempe & Tahu', detail: 'Masing-masing 2 blok', usage: 'Tue Lunch (Gado-Gado)' }
                            ].map((item) => (
                                <div key={item.name} className="p-3 md:p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-3 md:gap-4 group">
                                    <input className="mt-0.5 md:mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-4 h-4 md:w-5 md:h-5 cursor-pointer shrink-0" type="checkbox" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1b130d] dark:text-white text-sm md:text-base truncate">{item.name}</p>
                                                <p className="text-xs md:text-sm text-primary font-medium truncate">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
                                                <span className="material-symbols-outlined text-[10px] md:text-sm">restaurant</span>
                                                <span className="truncate max-w-[150px] sm:max-w-none">Digunakan di: <span className="font-semibold">{item.usage}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 md:p-4 bg-gray-50 dark:bg-[#201711]/50 transition-colors flex items-start gap-3 md:gap-4 group opacity-60">
                                <input checked readOnly className="mt-0.5 md:mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-4 h-4 md:w-5 md:h-5 cursor-pointer shrink-0" type="checkbox" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#1b130d] dark:text-white text-sm md:text-base line-through truncate">Santan</p>
                                            <p className="text-xs md:text-sm text-primary font-medium line-through truncate">3 pak (200ml)</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
                                            <span className="material-symbols-outlined text-[10px] md:text-sm">restaurant</span>
                                            <span className="truncate max-w-[150px] sm:max-w-none">Digunakan di: <span className="font-semibold">Tue Breakfast (Nasi Uduk)</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spices & Sauces Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 md:px-6 md:py-4 bg-red-50/50 dark:bg-red-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-700 dark:text-red-400">
                                    <span className="material-symbols-outlined text-lg md:text-2xl">soup_kitchen</span>
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-[#1b130d] dark:text-white">Bumbu & Saus</h3>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-300 dark:border-gray-700">4 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Kecap Manis', detail: 'Bango 275ml', usage: 'Mon Dinner (Sate), Thu Dinner (Nasi Goreng)' },
                                { name: 'Pasta Bumbu Kacang', detail: 'Merek Jawa asli, 2 pak', usage: 'Tue Lunch (Gado-Gado)' }
                            ].map((item) => (
                                <div key={item.name} className="p-3 md:p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-3 md:gap-4 group">
                                    <input className="mt-0.5 md:mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-4 h-4 md:w-5 md:h-5 cursor-pointer shrink-0" type="checkbox" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1b130d] dark:text-white text-sm md:text-base truncate">{item.name}</p>
                                                <p className="text-xs md:text-sm text-primary font-medium truncate">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
                                                <span className="material-symbols-outlined text-[10px] md:text-sm">restaurant</span>
                                                <span className="truncate max-w-[150px] sm:max-w-none">Digunakan di: <span className="font-semibold">{item.usage}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >


        </div >
    );
};

export default ShoppingList;
