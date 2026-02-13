import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const SocialContext = createContext({});

export const useSocial = () => useContext(SocialContext);

export const SocialProvider = ({ children }) => {
    const { user } = useAuth();
    const [followingSet, setFollowingSet] = useState(new Set());
    const [profileStatsCache, setProfileStatsCache] = useState({});

    // Refs for safe fetching and avoiding double-fetch in StrictMode
    const isFetchingRef = useRef(false);
    const lastUserIdRef = useRef(null);

    // Fetch follow status for current user
    const fetchFollowingStatus = useCallback(async () => {
        if (!user?.id || isFetchingRef.current) return;
        if (lastUserIdRef.current === user.id) return; // Already fetched for this user

        isFetchingRef.current = true;
        lastUserIdRef.current = user.id;

        try {
            const { supabase } = await import('../lib/supabaseClient');
            const { data } = await supabase
                .from('followers')
                .select('following_id')
                .eq('follower_id', user.id);

            if (data) {
                setFollowingSet(new Set(data.map(f => f.following_id)));
                console.log('✅ Following status cached:', data.length, 'users');
            }
        } catch (error) {
            console.error('🔴 Error fetching following status:', error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [user?.id]);

    // Fetch and cache profile stats (followers, following, recipes)
    const fetchProfileStats = useCallback(async (profileId) => {
        if (!profileId) return null;

        // Return cached stats if available
        if (profileStatsCache[profileId]) {
            return profileStatsCache[profileId];
        }

        try {
            const { supabase } = await import('../lib/supabaseClient');

            // Fetch all stats in parallel
            const [followersResult, followingResult, recipesResult] = await Promise.all([
                supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('following_id', profileId),
                supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('follower_id', profileId),
                supabase
                    .from('recipes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', profileId)
                    .eq('status', 'published')
            ]);

            const stats = {
                followers: followersResult.count || 0,
                following: followingResult.count || 0,
                recipes: recipesResult.count || 0
            };

            // Cache the result
            setProfileStatsCache(prev => ({
                ...prev,
                [profileId]: stats
            }));

            console.log('✅ Profile stats cached for:', profileId, stats);
            return stats;
        } catch (error) {
            console.error('🔴 Error fetching profile stats:', error);
            return null;
        }
    }, [profileStatsCache]);

    // Check if following a user (O(1) lookup)
    const isFollowing = useCallback((userId) => {
        return followingSet.has(userId);
    }, [followingSet]);

    // Update following status after follow/unfollow action
    const updateFollowingStatus = useCallback((userId, isFollowing) => {
        setFollowingSet(prev => {
            const next = new Set(prev);
            if (isFollowing) {
                next.add(userId);
            } else {
                next.delete(userId);
            }
            return next;
        });

        // Invalidate profile stats cache for this user
        setProfileStatsCache(prev => {
            const next = { ...prev };
            if (next[userId]) {
                next[userId] = {
                    ...next[userId],
                    followers: isFollowing
                        ? next[userId].followers + 1
                        : Math.max(0, next[userId].followers - 1)
                };
            }
            return next;
        });
    }, []);

    // Initial fetch on user change
    useEffect(() => {
        if (user?.id) {
            fetchFollowingStatus();
        } else {
            setFollowingSet(new Set());
            setProfileStatsCache({});
            lastUserIdRef.current = null;
        }
    }, [user?.id, fetchFollowingStatus]);

    // Fetch list of followers for a user
    const getFollowers = useCallback(async (userId) => {
        if (!userId) return [];
        try {
            const { supabase } = await import('../lib/supabaseClient');
            const { data, error } = await supabase
                .from('followers')
                .select(`
                    follower:follower_id (
                        id,
                        username,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('following_id', userId);

            if (error) throw error;
            return data.map(item => item.follower);
        } catch (error) {
            console.error('Error fetching followers:', error);
            return [];
        }
    }, []);

    // Fetch list of following for a user
    const getFollowing = useCallback(async (userId) => {
        if (!userId) return [];
        try {
            const { supabase } = await import('../lib/supabaseClient');
            const { data, error } = await supabase
                .from('followers')
                .select(`
                    following:following_id (
                        id,
                        username,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('follower_id', userId);

            if (error) throw error;
            return data.map(item => item.following);
        } catch (error) {
            console.error('Error fetching following:', error);
            return [];
        }
    }, []);

    const value = {
        followingSet,
        isFollowing,
        updateFollowingStatus,
        fetchProfileStats,
        profileStatsCache,
        getFollowers,
        getFollowing
    };

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};
