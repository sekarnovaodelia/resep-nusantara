import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/interactionService';

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Refs for safe polling and avoiding double-fetch in StrictMode
    const intervalRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Fetch count (HEAD request)
    const fetchUnreadCount = useCallback(async () => {
        if (!user || isFetchingRef.current) return;

        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (!error && count !== null) {
                setUnreadCount(count);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, [user]);

    // Fetch full list
    const loadNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await fetchNotifications(user.id);
            setNotifications(data);
            // Updating list often implies we might want to update count too
            // accessing the length of unread in data might not be accurate if paginated, 
            // but for simple cases it works. For now, we rely on the separate count fetch or manual sync.
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Smart Polling Logic
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (!user) {
            setUnreadCount(0);
            setNotifications([]);
            return;
        }

        const poll = async () => {
            if (document.hidden) return; // Don't poll if hidden
            if (isFetchingRef.current) return;

            isFetchingRef.current = true;
            await fetchUnreadCount();
            isFetchingRef.current = false;
        };

        // Initial fetch
        poll();

        // Setup interval (60 seconds)
        intervalRef.current = setInterval(poll, 60000);

        // Visibility listener
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // If coming back to tab, poll immediately if it's been a while? 
                // For simplicity, just poll immediately to refresh badge
                poll();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, fetchUnreadCount]);

    // Actions
    const markRead = async (id) => {
        // Optimistic
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await markNotificationRead(id);
    };

    const markAllRead = async () => {
        // Optimistic
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        if (user) await markAllNotificationsRead(user.id);
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        loadNotifications, // Manual refresh
        markRead,
        markAllRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
