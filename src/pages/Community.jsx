import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeedCard from '../components/FeedCard';
import { useAuth } from '../context/AuthContext';

const Community = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('terbaru');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const suggestionRef = useRef(null);

    // User data from auth
    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Pengguna';
    const username = profile?.username || user?.user_metadata?.username || 'user';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || (user ? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=EA6A12&color=fff' : 'https://ui-avatars.com/api/?name=Guest&background=EA6A12&color=fff');

    const [posts, setPosts] = useState([
        {
            id: 1,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5H8-WRyDVCmTAJlsUe7Csv1_FswYOA5vII1hUx-UGSNl_ypN3yGeFw54WKzwztvu6XcBhafv-6CwQ6BZErZNj4awwHcTOuIk-PDdq7h9H3GqZDx5T3zxY4b5ElTONswXzqVwsZ99yTBXop_KYIPt6Cx5Hfi7vjXkCdmUP0GzrzjFrOgrT0uZMGO9lwi0jE3TnZnJPsYwkeY-_xvKV6rie2koAGaQivxS3S62JNAH9o0xFpQzuUHUaLANxzJkXFX_MPmNUbKHhKyn2",
            name: "Siti Aminah",
            time: "2 jam yang lalu",
            location: "Jakarta",
            content: <>Akhirnya berhasil bikin Rendang yang empuk banget setelah percobaan ke-3! Rahasianya ternyata di santan kental yang dimasak perlahan. 😍 <span className="text-primary font-medium">#MasakanRumahan #RendangPadang</span></>,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdFUNPmf4Ot4SVouhTqKFu8kiYzvEHGPJU3YZMlqQVun1vkaTd6tKa-LNkC1QTjcXGlgSVxOAFJvGOg1s3aFQXshJWQ810vAnNhB5izkSmh07BUhA8rMEfT9bHr1l1K-zCMHZIRsy0kBvZUL20XJh6jXJWJBy0NbG99wd9akI10lO6mka4O35an6YXAr2XOD1E6ntZmNjB9Iw6XJ5zdUBEBIdjTrA-FW5acWxBShArpcnct79xKsCSMApDHRXhr_k7hy-r--BWwftR",
            recipeTitle: "Rendang Daging Sapi Empuk",
            recipeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpMEZQpqbKcgZ8fN2rp3USICjP3M-61jRkiN0eEVG2PWKCpAXn1zZvXZogKydST7GDozqnKx2lgeksj5mK3uqixvjgatR8LSFBw_tpoWLdtWsVEHPMTZTh4a7tZ2eqfxRK1qDk92DlCWWj3NjFUekfeRAXPGjFzbmT7zwCIIzYPqVlJNoXNeUqL0OVLLGA_ue-atMlAziZqyGSCCM4ZEzNl4dkdPAnYJtMdZ0TvTA_Hha6RAYA5dzTH9I2M-yTtIiIFNTUCGUMfr_A",
            recipeId: "1",
            likes: 2400,
            comments: 142,
            initialLiked: true
        },
        {
            id: 2,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJKNjAKTjtgePs5upaANtlQak7h9MfgqefiHk8UtzXsOEsX_koP1HV2eumHSICTYGusis3uVnCIza54-2rHqpLLK5wJs7BixvGsvsgl-VAPqpCMecAc9oxCtqCkpaZRyPaTss7KxH0XJ1anh3MmtAlIvH9--DqCBvYyo4fAanLxYZZPtJJr5EQSQGjMqueSM5OqBdOw4aLBAlALIW0-95p4W3flidWv99b6oi0mkZph4_uaVkjcdqui5XlSb4bH0llSrbdEhOzw2VtAlUjFp",
            name: "Dimas Anggara",
            time: "5 jam yang lalu",
            location: "Bandung",
            content: <>Sarapan simpel tapi nikmat: Nasi Goreng Kampung pakai pete! Siapa tim pete di sini? 🙌 <span className="text-primary font-medium">#Sarapan #NasiGoreng</span></>,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6k0Xw8FLmxP9dqEspyBqDpSMzvzLJtoBjmu0TRq6g6ZHtLwedjVjgL4GL2vd_Er6lg8Vg1h8X_UIjPMzAKjBbklk0DQOxSij7MQIwqOLPOnw2YnWLjcouF61jlSwyYKnpr4q2lacX3rXGMsZgwEk-peyQP_73sNtzYUvaxSicBE8rZFJxZWA95mGXlFupWngMFzkJ_ZNVssgJV-bnwjA3mQGwJh7a9HoN8Cg80IJBH6nvY4rQl8q7JMjhVdTuq_-XNBkmz8IAmGK5",
            recipeTitle: "Nasi Goreng Kampung Spesial",
            recipeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOFxVsfRGOOiKKSG5smY9grR-LeaV1BqSMqhOJrUp9NvKmzkZV9r77h1lOe81-a9xatEEQRuJ1pRUhe1Z9eUDUwWAEz_XFYwR8Xa32_T6NHvPNqTcJXbHJ4qjyNgzhBzs85cAEC3jLLOiZn4L8I01vjf5KCC7jqHbhDboVRqaQ6dJooz79IbprDz_SAVD6S7weLT09hoNc6eaxVUmJoTMaVK8lQAAgQIfB2cSAc-vosSEArwyoCYIfx4fNEwPebjF0QXROeGh-qL9a",
            recipeId: "3",
            likes: 856,
            comments: 45
        }
    ]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [newPostText, setNewPostText] = useState('');

    const recipeSuggestions = [
        { id: 1, title: 'Rendang Sapi Empuk', image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=200&auto=format&fit=crop' },
        { id: 2, title: 'Sate Ayam Madura', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=200&auto=format&fit=crop' },
        { id: 3, title: 'Nasi Goreng Kampung', image: 'https://images.unsplash.com/photo-1601050638911-c3239a4fe359?q=80&w=200&auto=format&fit=crop' },
        { id: 4, title: 'Gado-Gado Betawi', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setIsSuggestionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsSuggestionsOpen(false);
    }

    const handlePost = () => {
        if (!newPostText.trim() && !selectedRecipe) return;

        const newPost = {
            id: Date.now(),
            avatar: avatarUrl,
            name: displayName,
            time: "Baru saja",
            location: profile?.location || "Indonesia",
            content: newPostText,
            image: "", // Placeholder for images if needed in future
            recipeTitle: selectedRecipe?.title,
            recipeImage: selectedRecipe?.image,
            recipeId: selectedRecipe?.id,
            likes: 0,
            comments: 0
        };

        setPosts([newPost, ...posts]);
        setNewPostText('');
        setSelectedRecipe(null);
    }

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Navigation & User (Sticky) */}
                <aside className="hidden md:block md:col-span-3 sticky top-24 space-y-6">
                    {/* User Mini Card */}
                    {user && (
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col items-center text-center">
                            <div className="size-20 rounded-full bg-cover bg-center mb-4 ring-4 ring-orange-50 dark:ring-white/5" data-alt={`Profile photo of ${displayName}`} style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                            <h3 className="font-bold text-lg leading-tight text-text-main dark:text-white">{displayName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">@{username}</p>
                            <div className="mt-6 flex w-full justify-between px-2 text-sm text-text-main dark:text-white">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">0</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Resep</span>
                                </div>
                                <div className="flex flex-col border-x border-[#e7d9cf] dark:border-[#3d2f26] w-full mx-2">
                                    <span className="font-bold text-lg">0</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Pengikut</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">0</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Disimpan</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Community Nav */}
                    <nav className="bg-card-light dark:bg-card-dark p-2 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26] flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab('terbaru')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'terbaru' ? 'bg-orange-50 dark:bg-white/5 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined">rss_feed</span>
                            Feed Terbaru
                        </button>
                        <button
                            onClick={() => setActiveTab('populer')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'populer' ? 'bg-orange-50 dark:bg-white/5 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined">trending_up</span>
                            Populer
                        </button>
                    </nav>
                </aside>

                {/* Center Column: Feed (Scrollable) */}
                <section className="col-span-1 md:col-span-9 lg:col-span-9 space-y-4 sm:space-y-6">
                    {/* Mobile Tabs */}
                    <div className="md:hidden flex border-b border-[#e7d9cf] dark:border-[#3d2f26] mb-2 sticky top-[64px] bg-background-light dark:bg-background-dark z-20 -mx-4 px-4">
                        <button
                            onClick={() => setActiveTab('terbaru')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'terbaru' ? 'text-primary' : 'text-text-secondary'}`}
                        >
                            Feed Terbaru
                            {activeTab === 'terbaru' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('populer')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'populer' ? 'text-primary' : 'text-text-secondary'}`}
                        >
                            Populer
                            {activeTab === 'populer' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                        </button>
                    </div>

                    {/* Status Composer */}
                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-[#e7d9cf] dark:border-[#3d2f26]">
                        <div className="flex gap-4">
                            <div className="size-10 rounded-full bg-cover bg-center flex-shrink-0" data-alt="User avatar" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
                            <div className="flex-grow">
                                <input
                                    className="w-full bg-[#f8f7f6] dark:bg-[#221810] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white placeholder-gray-400 outline-none"
                                    placeholder="Punya tips masak atau resep baru?"
                                    type="text"
                                    value={newPostText}
                                    onChange={(e) => setNewPostText(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Composer Recipe Widget */}
                        {selectedRecipe && (
                            <div className="mt-3 w-full">
                                <Link
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-orange-50 dark:bg-[#3d2f26] p-3 rounded-xl border border-orange-100 dark:border-white/5 hover:bg-orange-100 dark:hover:bg-white/10 transition-colors group/widget relative"
                                    to={`/recipe/${selectedRecipe.id}`}
                                >
                                    {/* Image */}
                                    <div
                                        className="w-full aspect-video sm:size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                        data-alt="Recipe thumbnail"
                                        style={{ backgroundImage: `url("${selectedRecipe.image}")` }}
                                    ></div>

                                    {/* Text Info */}
                                    <div className="flex-grow w-full sm:w-auto">
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">Masak Resep</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/widget:text-primary transition-colors line-clamp-2">{selectedRecipe.title}</p>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); }}
                                        className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto text-gray-400 hover:text-red-500 transition-colors bg-white/50 sm:bg-transparent rounded-full p-1 sm:p-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </Link>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#f3ece7] dark:border-[#3d2f26] px-2 relative">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
                                    className={`flex items-center gap-2 transition-colors text-sm font-medium ${isSuggestionsOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                                    Mention Resep
                                </button>

                                {/* Recipe Suggestions Dropdown */}
                                {isSuggestionsOpen && (
                                    <div ref={suggestionRef} className="absolute left-0 top-full mt-2 w-72 bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl border border-[#e7d9cf] dark:border-[#3d2f26] overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-[#f3ece7] dark:border-[#3d2f26] bg-orange-50/30 dark:bg-white/5">
                                            <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Pilih Resep Anda</p>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto py-1">
                                            {recipeSuggestions.map((recipe) => (
                                                <button
                                                    key={recipe.id}
                                                    onClick={() => handleSelectRecipe(recipe)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left group"
                                                >
                                                    <div className="size-11 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-white/10" style={{ backgroundImage: `url("${recipe.image}")` }}></div>
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">{recipe.title}</p>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Klik untuk mention</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handlePost}
                                className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newPostText.trim() && !selectedRecipe}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {activeTab === 'terbaru' ? (
                        <div className="space-y-4 sm:space-y-6">
                            {posts.map(post => (
                                <FeedCard key={post.id} {...post} />
                            ))}
                        </div>
                    ) : (
                        // Dummy implementation for 'Populer' tab to reuse FeedCard
                        <div className="space-y-4 sm:space-y-6">
                            {posts.slice(0, 1).map(post => ( // Just showing one for popular
                                <FeedCard key={post.id} {...post} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Community;
