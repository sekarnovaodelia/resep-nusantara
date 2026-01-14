import React, { useEffect, useRef } from 'react';

const SearchMobileModal = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
    const inputRef = useRef(null);
    const trendingSearches = [
        'Nasi Goreng',
        'Sate Ayam',
        'Rendang Sapi',
        'Soto Betawi',
        'Gado-gado'
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - Starts below navbar */}
            <div
                className="fixed inset-x-0 bottom-0 top-16 bg-background-dark/40 backdrop-blur-sm z-20 transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Mobile/Tablet Top-Center Modal - Positioned below navbar */}
            <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex items-start justify-center p-4 sm:p-6 pointer-events-none">
                <div className="w-full max-w-xl bg-white dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark overflow-hidden pointer-events-auto animate-in slide-in-from-top-4 duration-300 flex flex-col">

                    {/* Search Input Header */}
                    <div className="p-4 sm:p-6 border-b border-border-light dark:border-border-dark">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-2xl">search</span>
                            <input
                                ref={inputRef}
                                className="w-full h-14 pl-12 pr-12 rounded-2xl bg-background-light dark:bg-accent-dark border-none focus:ring-2 focus:ring-primary text-lg font-medium dark:text-white transition-all placeholder:text-text-secondary/50"
                                placeholder="Cari resep favoritmu..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-text-secondary hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Results / Suggestions */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh] p-4 sm:p-8 space-y-8 scrollbar-hide">
                        {searchQuery ? (
                            <section className="animate-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 text-text-secondary/60 ml-2">
                                    Hasil untuk "{searchQuery}"
                                </h3>
                                <div className="space-y-1">
                                    <Item icon="receipt_long" text={`Cari Resep "${searchQuery}"`} />
                                    <Item icon="person" text={`Cari Pengguna "${searchQuery}"`} />
                                    <Item icon="restaurant" text={`Cari Bahan "${searchQuery}"`} />
                                </div>
                            </section>
                        ) : (
                            <section className="animate-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 text-text-secondary/60 ml-2">
                                    Populer Sekarang
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {trendingSearches.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSearchQuery(item)}
                                            className="px-5 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/20 
                                                       border border-primary/10 text-sm font-bold text-primary 
                                                       transition-all hover:scale-105 active:scale-95"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Quick Tips removed as requested */}
                    </div>
                </div>
            </div>
        </>
    );
};

function Item({ icon, text }) {
    return (
        <div className="p-4 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 
                        cursor-pointer flex items-center gap-4 transition-all group active:scale-[0.98]">
            <div className="size-10 rounded-xl bg-background-light dark:bg-accent-dark flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="text-base font-bold text-text-main dark:text-gray-200">{text}</span>
            <span className="material-symbols-outlined ml-auto text-text-secondary/30 group-hover:text-primary/50 transition-colors">chevron_right</span>
        </div>
    );
}

export default SearchMobileModal;

