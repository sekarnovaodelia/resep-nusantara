import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (user && id) {
                const { data } = await supabase
                    .from('bookmarks')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('recipe_id', id)
                    .single();
                setIsBookmarked(!!data);
            }
        };
        checkBookmarkStatus();
    }, [user, id]);

    const handleBookmark = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { toggleBookmark } = await import('../lib/recipeService');
            const result = await toggleBookmark(user.id, id);
            setIsBookmarked(result);

            // Optional: Show toast notification
            console.log(result ? 'Bookmarked' : 'Bookmark removed');
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: `Cek resep ${recipe.title} ini di Resep Nusantara!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Tautan resep disalin ke clipboard!');
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);

            // Fetch recipe with region
            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select(`
                    *,
                    regions(name)
                `)
                .eq('id', id)
                .single();

            if (recipeError || !recipeData) {
                console.error('Recipe not found:', recipeError);
                setLoading(false);
                return;
            }

            setRecipe(recipeData);

            // Fetch author profile
            const { data: authorData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', recipeData.user_id)
                .single();

            setAuthor(authorData);

            // Fetch ingredients
            const { data: ingredientsData } = await supabase
                .from('recipe_ingredients')
                .select('*')
                .eq('recipe_id', id)
                .order('order_index');

            setIngredients(ingredientsData || []);

            // Fetch steps
            const { data: stepsData } = await supabase
                .from('recipe_steps')
                .select('*')
                .eq('recipe_id', id)
                .order('step_number');

            setSteps(stepsData || []);

            setLoading(false);
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary">Memuat resep...</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">restaurant_menu</span>
                <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Resep Tidak Ditemukan</h2>
                <p className="text-text-secondary mb-6">Resep yang Anda cari tidak ada atau telah dihapus.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    const defaultImage = 'https://placehold.co/800x600/f5f5f5/aaa?text=No+Image';
    const authorAvatar = author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.full_name || 'User')}&background=EA6A12&color=fff`;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8 lg:px-8">
            {/* Lightbox for Ingredients */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Detail Bahan"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                {recipe.regions?.name && (
                    <>
                        <span className="hover:text-primary transition-colors">{recipe.regions.name}</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </>
                )}
                <span className="text-text-main dark:text-gray-200 font-medium">{recipe.title}</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                {/* Image Section */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${recipe.main_image_url || defaultImage}')` }}
                        ></div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={handleBookmark}
                                className={`bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-all shadow-sm ${isBookmarked ? 'text-primary' : 'text-text-main dark:text-gray-200 hover:text-primary'}`}
                                title={isBookmarked ? "Hapus Bookmark" : "Simpan Resep"}
                            >
                                <span className={`material-symbols-outlined ${isBookmarked ? 'fill-current' : ''}`}>
                                    {isBookmarked ? 'bookmark' : 'bookmark_border'}
                                </span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm p-2 rounded-full text-text-main dark:text-gray-200 hover:text-primary hover:scale-110 transition-all shadow-sm"
                                title="Bagikan Resep"
                            >
                                <span className="material-symbols-outlined">share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                {recipe.is_published && (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Published</span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main dark:text-white leading-tight mb-4">
                                {recipe.title}
                            </h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
                                {recipe.description || 'Tidak ada deskripsi.'}
                            </p>

                            {/* Author Info */}
                            {author && (
                                <div className="flex items-center gap-3 mb-6 p-3 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark">
                                    <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${authorAvatar}')` }}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-text-main dark:text-white">{author.full_name || author.username || 'Pengguna'}</p>
                                        <p className="text-xs text-text-secondary dark:text-gray-400">{author.location || 'Indonesia'}</p>
                                    </div>
                                    <button className="text-primary text-sm font-bold px-3 py-1.5 hover:bg-primary/10 rounded-lg transition-colors">
                                        Follow
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients & Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Ingredients Column */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Bahan-bahan</h3>
                            <span className="text-sm text-text-secondary">{ingredients.length} bahan</span>
                        </div>
                        {/* Ingredients List */}
                        <div className="space-y-3">
                            {ingredients.length === 0 ? (
                                <p className="text-text-secondary text-sm">Tidak ada bahan.</p>
                            ) : (
                                ingredients.map((ing, index) => (
                                    <div
                                        key={ing.id || index}
                                        className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                        onClick={() => ing.image_url && setSelectedImage(ing.image_url)}
                                    >
                                        {ing.image_url ? (
                                            <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: `url('${ing.image_url}')` }}></div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-400">grocery</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">{ing.quantity || '-'}</p>
                                            <p className="text-sm text-text-secondary dark:text-gray-400">{ing.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Methods Column */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">Cara Membuat</h2>
                            <span className="text-sm text-text-secondary">{steps.length} langkah</span>
                        </div>

                        <div className="space-y-8">
                            {steps.length === 0 ? (
                                <p className="text-text-secondary">Tidak ada langkah.</p>
                            ) : (
                                steps.map((step, index) => (
                                    <div key={step.id || index} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full ${index === steps.length - 1 ? 'bg-white dark:bg-surface-dark border-2 border-primary text-primary' : 'bg-primary text-white shadow-md shadow-primary/30'} flex items-center justify-center font-bold text-sm z-10`}>
                                                {step.step_number || index + 1}
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className="w-0.5 h-full bg-border-light dark:bg-border-dark mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            {step.title && (
                                                <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">{step.title}</h4>
                                            )}
                                            <p className="text-text-secondary dark:text-gray-400 leading-relaxed mb-4">{step.description}</p>
                                            {step.image_url && (
                                                <div className="w-full h-48 sm:h-64 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${step.image_url}')` }}></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
