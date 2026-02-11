import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const AdminRecipePreviewModal = ({ isOpen, onClose, recipeId, onApprove, onReject }) => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && recipeId) {
            fetchRecipeDetails();
        } else {
            setRecipe(null);
            setError(null);
        }
    }, [isOpen, recipeId]);

    const fetchRecipeDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch recipe details
            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select(`
                    *,
                    regions(name),
                    user_profiles:user_id(*)
                `)
                .eq('id', recipeId)
                .single();

            if (recipeError) throw recipeError;

            // Fetch ingredients and steps separately (avoids RLS join issues on pending recipes)
            const [ingredientsResult, stepsResult] = await Promise.all([
                supabase
                    .from('recipe_ingredients')
                    .select('*')
                    .eq('recipe_id', recipeId)
                    .order('order_index', { ascending: true }),
                supabase
                    .from('recipe_steps')
                    .select('*')
                    .eq('recipe_id', recipeId)
                    .order('step_number', { ascending: true })
            ]);

            setRecipe({
                ...recipeData,
                recipe_ingredients: ingredientsResult.data || [],
                recipe_steps: stepsResult.data || []
            });
        } catch (err) {
            console.error('Error fetching recipe details for preview:', err);
            setError('Failed to load recipe details.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-surface-dark w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 border border-border-light dark:border-border-dark flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-[#1e1611]">
                    <div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white">Preview Resep</h3>
                        {recipe && <p className="text-sm text-text-secondary dark:text-gray-400">Oleh {recipe.user_profiles?.full_name || 'Chef'}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-text-secondary">Memuat detail resep...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 font-bold">{error}</p>
                            <button onClick={fetchRecipeDetails} className="mt-4 text-primary hover:underline">Coba lagi</button>
                        </div>
                    ) : recipe ? (
                        <div className="space-y-8">
                            {/* Main Image & Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                                    <img
                                        src={getOptimizedImageUrl(recipe.main_image_url || 'https://placehold.co/600x400', { width: 600 })}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">{recipe.title}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.regions && (
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                {recipe.regions.name}
                                            </span>
                                        )}
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-text-secondary text-xs font-bold rounded-full uppercase">
                                            {recipe.status}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                                        {recipe.description}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-border-light dark:border-border-dark" />

                            {/* Ingredients & Steps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">grocery</span>
                                        Bahan-bahan
                                    </h4>
                                    <ul className="space-y-2">
                                        {(recipe.recipe_ingredients || [])
                                            .sort((a, b) => a.order_index - b.order_index)
                                            .map((ing, idx) => (
                                                <li key={idx} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-accent-dark/30 rounded-lg">
                                                    <span className="text-text-main dark:text-gray-300">{ing.name}</span>
                                                    <span className="font-bold text-primary">{ing.quantity}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">menu_book</span>
                                        Langkah Pembuatan
                                    </h4>
                                    <div className="space-y-4">
                                        {(recipe.recipe_steps || [])
                                            .sort((a, b) => a.step_number - b.step_number)
                                            .map((step, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                        {step.step_number}
                                                    </div>
                                                    <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-[#1e1611] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl border border-border-light dark:border-border-dark font-bold text-text-main dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                        Tutup
                    </button>
                    {recipe && (recipe.status === 'pending' || recipe.status === 'rejected') && (
                        <button
                            onClick={() => {
                                onApprove(recipe.id);
                                onClose();
                            }}
                            className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95"
                        >
                            Approve
                        </button>
                    )}
                    {recipe && (recipe.status === 'pending' || recipe.status === 'published') && (
                        <button
                            onClick={() => {
                                onReject(recipe.id);
                                onClose();
                            }}
                            className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
                        >
                            Reject
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRecipePreviewModal;
