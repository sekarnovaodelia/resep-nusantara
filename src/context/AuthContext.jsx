import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null); // Store full session
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('🟢 Auth state changed:', event, session?.user?.id);
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    console.log('🟢 Fetching profile for user:', session.user.id);
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        console.log('🟢 fetchProfile called for userId:', userId);
        try {
            console.log('🟢 Querying profiles table...');
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            console.log('🟢 Profile query result:', { data, error });

            if (error) throw error;
            console.log('🟢 Setting profile data:', data);
            setProfile(data);
        } catch (error) {
            console.error('🔴 Error fetching profile:', error);
        } finally {
            console.log('🟢 fetchProfile finally - setting loading to false');
            setLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    const value = {
        user,
        session, // Expose session
        profile,
        loading,
        signOut,
        refreshProfile: () => user && fetchProfile(user.id),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
