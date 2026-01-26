import React from 'react';

const SearchDropdown = ({ isOpen, onClose, searchQuery, setSearchQuery, onSearch }) => {
    const trendingSearches = [
        'Nasi Goreng',
        'Sate Ayam',
        'Rendang Sapi',
        'Soto Betawi',
        'Gado-gado'
    ];

    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="mx-auto max-w-2xl bg-white dark:bg-[#1a1614] rounded-3xl border border-border-light dark:border-border-dark overflow-hidden">
                <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-8">
                    {searchQuery ? (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-text-secondary">
                                Hasil untuk "{searchQuery}"
                            </h3>
                            <button
                                onClick={() => onSearch && onSearch(searchQuery)}
                                className="w-full text-left px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold flex items-center gap-3 transition-colors"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Cari "{searchQuery}"
                            </button>
                        </section>
                    ) : (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-text-secondary">
                                Populer Sekarang
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSearchQuery(item);
                                            if (onSearch) onSearch(item);
                                        }}
                                        className="px-4 py-2 rounded-full bg-primary/5
                                                   hover:bg-primary/10 border border-primary/10
                                                   text-sm font-bold text-primary transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

function Item({ icon, text }) {
    return (
        <div className="p-3 rounded-xl hover:bg-background-light dark:hover:bg-background-dark
                        cursor-pointer flex items-center gap-3 transition-colors">
            <span className="material-symbols-outlined text-text-secondary">{icon}</span>
            <span className="text-sm font-bold">{text}</span>
        </div>
    );
}

export default SearchDropdown;
