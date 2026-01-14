import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShoppingList = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-[#1b130d] dark:text-[#f3ece7] font-display">
            {/* Header / Sub-Header */}
            <div className="p-6 flex justify-between items-center bg-white dark:bg-surface-dark border-b border-gray-300 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#1b130d] dark:text-white">Daftar Belanja Mingguan</h2>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-[#9a6c4c] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            23 - 29 Oktober 2023
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-[#9a6c4c] hover:text-[#1b130d] dark:hover:text-white transition-colors" title="Cetak">
                        <span className="material-symbols-outlined">print</span>
                    </button>
                    <button className="p-2 text-[#9a6c4c] hover:text-[#1b130d] dark:hover:text-white transition-colors" title="Download">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                    <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
                    <button
                        onClick={() => navigate('/planner')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-[#1b130d] dark:text-white hover:bg-background-light dark:hover:bg-[#342a22] transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Kembali ke Perencana
                    </button>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-sm transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Tandai Selesai
                    </button>
                </div>
            </div>



            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
                <div className="space-y-8">
                    {/* Fresh Produce Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-green-50/50 dark:bg-green-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-700 dark:text-green-400">
                                    <span className="material-symbols-outlined">eco</span>
                                </div>
                                <h3 className="font-bold text-lg text-[#1b130d] dark:text-white">Bahan Segar</h3>
                            </div>
                            <span className="text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700">8 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Bawang Merah & Putih', detail: 'Masing-masing 250g', usage: 'Mon Dinner, Wed Lunch' },
                                { name: 'Timun & Tomat', detail: '500g mix', usage: 'Tue Lunch (Gado-Gado)' },
                                { name: 'Cabai Rawit', detail: 'Pak 100g', usage: 'Mon Dinner, Fri Lunch' },
                                { name: 'Kangkung', detail: '2 ikat', usage: 'Thu Lunch' }
                            ].map((item) => (
                                <div key={item.name} className="p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-4 group">
                                    <input className="mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-5 h-5 cursor-pointer" type="checkbox" />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-[#1b130d] dark:text-white text-base">{item.name}</p>
                                                <p className="text-sm text-primary font-medium">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto">
                                                <span className="material-symbols-outlined text-sm">restaurant</span>
                                                Digunakan di: <span className="font-semibold">{item.usage}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Protein & Pantry Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-orange-50/50 dark:bg-orange-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-700 dark:text-orange-400">
                                    <span className="material-symbols-outlined">egg_alt</span>
                                </div>
                                <h3 className="font-bold text-lg text-[#1b130d] dark:text-white">Protein & Bahan Kering</h3>
                            </div>
                            <span className="text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700">5 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Dada Ayam', detail: '1.5kg, iris/sate', usage: 'Mon Dinner (Sate), Wed Lunch (Soto)' },
                                { name: 'Beras Jasmine', detail: 'Kantong 5kg', usage: 'Staple sepanjang minggu' },
                                { name: 'Tempe & Tahu', detail: 'Masing-masing 2 blok', usage: 'Tue Lunch (Gado-Gado)' }
                            ].map((item) => (
                                <div key={item.name} className="p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-4 group">
                                    <input className="mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-5 h-5 cursor-pointer" type="checkbox" />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-[#1b130d] dark:text-white text-base">{item.name}</p>
                                                <p className="text-sm text-primary font-medium">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto">
                                                <span className="material-symbols-outlined text-sm">restaurant</span>
                                                Digunakan di: <span className="font-semibold">{item.usage}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 bg-gray-50 dark:bg-[#201711]/50 transition-colors flex items-start gap-4 group opacity-60">
                                <input checked readOnly className="mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-5 h-5 cursor-pointer" type="checkbox" />
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <p className="font-bold text-[#1b130d] dark:text-white text-base line-through">Santan</p>
                                            <p className="text-sm text-primary font-medium line-through">3 pak (200ml)</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto">
                                            <span className="material-symbols-outlined text-sm">restaurant</span>
                                            Digunakan di: <span className="font-semibold">Tue Breakfast (Nasi Uduk)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spices & Sauces Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-red-50/50 dark:bg-red-950/20 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-700 dark:text-red-400">
                                    <span className="material-symbols-outlined">soup_kitchen</span>
                                </div>
                                <h3 className="font-bold text-lg text-[#1b130d] dark:text-white">Bumbu & Saus</h3>
                            </div>
                            <span className="text-xs font-bold text-[#9a6c4c] bg-white dark:bg-[#342a22] px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700">4 item</span>
                        </div>
                        <div className="divide-y divide-gray-300 dark:divide-gray-700">
                            {[
                                { name: 'Kecap Manis', detail: 'Bango 275ml', usage: 'Mon Dinner (Sate), Thu Dinner (Nasi Goreng)' },
                                { name: 'Pasta Bumbu Kacang', detail: 'Merek Jawa asli, 2 pak', usage: 'Tue Lunch (Gado-Gado)' }
                            ].map((item) => (
                                <div key={item.name} className="p-4 hover:bg-[#fcfaf8] dark:hover:bg-[#342a22] transition-colors flex items-start gap-4 group">
                                    <input className="mt-1 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-[#342a22] w-5 h-5 cursor-pointer" type="checkbox" />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-[#1b130d] dark:text-white text-base">{item.name}</p>
                                                <p className="text-sm text-primary font-medium">{item.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#9a6c4c] bg-[#f8f7f6] dark:bg-[#201711] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 self-start sm:self-auto">
                                                <span className="material-symbols-outlined text-sm">restaurant</span>
                                                Digunakan di: <span className="font-semibold">{item.usage}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ShoppingList;
