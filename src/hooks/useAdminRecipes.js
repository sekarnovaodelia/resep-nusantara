import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const SUBSCRIPTION_CHANNEL = 'admin-recipes-updates';

/**
 * Custom hook for Admin Dashboard logic.
 * Handles data fetching, server-side filtering, optimistic updates, and realtime subscription.
 * 
 * @param {string} statusFilter - 'pending', 'published', 'rejected', 'draft'
 */
export function useAdminRecipes(statusFilter = 'pending') {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const processingRef = useRef(new Set()); // Track IDs being processed to prevent race/dupes

    // Fetch recipes with server-side filtering
    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('recipes')
                .select(`
                    *,
                    profiles:user_id (username, full_name, avatar_url)
                `)
                .eq('status', statusFilter)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRecipes(data || []);
        } catch (err) {
            console.error('🔴 Error fetching admin recipes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    // Initial Fetch & Realtime Subscription
    useEffect(() => {
        let mounted = true;

        // 1. Initial Fetch
        fetchRecipes();

        // 2. Realtime Subscription
        const channel = supabase
            .channel(SUBSCRIPTION_CHANNEL)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'recipes',
                },
                (payload) => {
                    if (!mounted) return;

                    const updatedRecipe = payload.new;
                    const oldRecipe = payload.old;

                    // Case A: Status changed FROM current filter TO something else -> Remove
                    if (oldRecipe.status === statusFilter && updatedRecipe.status !== statusFilter) {
                        setRecipes(prev => prev.filter(r => r.id !== updatedRecipe.id));
                    }
                    // Case B: Status changed FROM something else TO current filter -> Add/Update
                    else if (updatedRecipe.status === statusFilter) {
                        // We need to fetch the profile data for the new item since payload usually doesn't have joins
                        // For simplicity in MVP, we can just re-fetch the list or fetch single item
                        // Re-fetching is safer for data consistency with joins
                        fetchRecipes();
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [statusFilter, fetchRecipes]);

    /**
     * Update recipe status with Optimistic UI
     * @param {string} recipeId 
     * @param {string} newStatus 
     */
    const updateStatus = async (recipeId, newStatus) => {
        // Prevent race condition / double clicks
        if (processingRef.current.has(recipeId)) return;
        processingRef.current.add(recipeId);

        // Snapshot for rollback
        const previousRecipes = [...recipes];

        // Optimistic Update: Remove from list immediately (since it will likely move to another tab)
        // or Update status if we were viewing 'all' (but we are filtering strict tabs)
        setRecipes(prev => prev.filter(r => r.id !== recipeId));

        try {
            const { error } = await supabase
                .from('recipes')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString() // Explicitly set updated_at
                })
                .eq('id', recipeId);

            if (error) throw error;

            // Success: Realtime subscription will handle the "Add to destination tab" logic
            // The "Remove from source tab" is already handled optimally here.

        } catch (err) {
            console.error('🔴 Failed to update status:', err);
            // Rollback
            setRecipes(previousRecipes);
            setError(`Gagal mengubah status: ${err.message}`);
        } finally {
            processingRef.current.delete(recipeId);
        }
    };

    return {
        recipes,
        loading,
        error,
        refresh: fetchRecipes,
        updateStatus
    };
}
