import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext({});

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
    const { user } = useAuth();
    const [bookmarkedRecipeIds, setBookmarkedRecipeIds] = useState(new Set());

    // Refs for safe fetching and avoiding double-fetch in StrictMode
    const isFetchingRef = useRef(false);
    const lastUserIdRef = useRef(null);

    // Fetch all bookmarks for user
    const fetchBookmarks = useCallback(async () => {
        if (!user?.id || isFetchingRef.current) return;
        if (lastUserIdRef.current === user.id) return; // Already fetched for this user

        isFetchingRef.current = true;
        lastUserIdRef.current = user.id;

        try {
            const { supabase } = await import('../lib/supabaseClient');
            const { data } = await supabase
                .from('bookmarks')
                .select('recipe_id')
                .eq('user_id', user.id);

            if (data) {
                setBookmarkedRecipeIds(new Set(data.map(b => b.recipe_id)));
                console.log('✅ Bookmarks cached:', data.length, 'recipes');
            }
        } catch (error) {
            console.error('🔴 Error fetching bookmarks:', error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [user?.id]);

    // Check if recipe is bookmarked (O(1) lookup)
    const isBookmarked = useCallback((recipeId) => {
        return bookmarkedRecipeIds.has(recipeId);
    }, [bookmarkedRecipeIds]);

    // Toggle bookmark status locally
    const toggleBookmark = useCallback((recipeId, bookmarked) => {
        setBookmarkedRecipeIds(prev => {
            const next = new Set(prev);
            if (bookmarked) {
                next.add(recipeId);
            } else {
                next.delete(recipeId);
            }
            return next;
        });
    }, []);

    // Initial fetch on user change
    useEffect(() => {
        if (user?.id) {
            fetchBookmarks();
        } else {
            setBookmarkedRecipeIds(new Set());
            lastUserIdRef.current = null;
        }
    }, [user?.id, fetchBookmarks]);

    const value = {
        bookmarkedRecipeIds,
        isBookmarked,
        toggleBookmark,
        refetch: fetchBookmarks
    };

    return (
        <BookmarkContext.Provider value={value}>
            {children}
        </BookmarkContext.Provider>
    );
};
