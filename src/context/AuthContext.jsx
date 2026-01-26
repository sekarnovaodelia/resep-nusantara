import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ref to track the current profile ID being fetched to prevent duplicates
    const fetchingProfileId = React.useRef(null);

    // Initial load & Auth Listener
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            // 1. Get initial session
            const { data: { session: initialSession } } = await supabase.auth.getSession();

            if (mounted) {
                setSession(initialSession);
                setUser(initialSession?.user ?? null);
                if (initialSession?.user) {
                    await fetchProfileInternal(initialSession.user.id);
                }
                setLoading(false);
            }

            // 2. Setup listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, currentSession) => {
                    if (!mounted) return;

                    console.log('🟢 Auth state changed:', event);
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);

                    if (currentSession?.user) {
                        // Only fetch if not already fetched/fetching for this user
                        await fetchProfileInternal(currentSession.user.id);
                    } else {
                        setProfile(null);
                        fetchingProfileId.current = null;
                        setLoading(false);
                    }
                }
            );

            return () => {
                mounted = false;
                subscription.unsubscribe();
            };
        };

        initAuth();
    }, []);

    const fetchProfileInternal = async (userId) => {
        // Prevent redundant fetches for same user
        if (fetchingProfileId.current === userId) return;
        fetchingProfileId.current = userId;

        console.log('🟢 Fetching profile for:', userId);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (!error && data) {
                setProfile(data);
            } else {
                console.error('🔴 Error fetching profile:', error);
                setProfile(null);
            }
        } catch (error) {
            console.error('🔴 Unexpected error:', error);
            setProfile(null);
        }
    };

    const signOut = async () => {
        fetchingProfileId.current = null;
        setUser(null);
        setSession(null);
        setProfile(null);
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signOut,
        refreshProfile: () => user && (fetchingProfileId.current = null, fetchProfileInternal(user.id)),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
