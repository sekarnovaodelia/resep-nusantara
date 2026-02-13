import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/interactionService';

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

// Polling interval: 2 minutes
const POLL_INTERVAL = 120_000;
// Minimum gap between polls to prevent duplicate requests
const MIN_POLL_GAP = 10_000;

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Refs for safe polling
    const intervalRef = useRef(null);
    const isFetchingRef = useRef(false);
    const lastPollTimeRef = useRef(0);
    const mountedRef = useRef(false);
    const userIdRef = useRef(null);

    // Keep userIdRef in sync
    useEffect(() => {
        userIdRef.current = user?.id || null;
    }, [user?.id]);

    // Fetch count (HEAD request)
    const fetchUnreadCount = useCallback(async () => {
        const uid = userIdRef.current;
        if (!uid) return;

        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', uid)
                .eq('is_read', false);

            if (!error && count !== null) {
                setUnreadCount(count);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []); // Stable — uses ref internally

    // Fetch full list
    const loadNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await fetchNotifications(user.id);
            setNotifications(data);
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Polling Logic — single source of truth for scheduling
    useEffect(() => {
        // Cleanup previous interval on re-run (StrictMode safety)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!user?.id) {
            setUnreadCount(0);
            setNotifications([]);
            return;
        }

        mountedRef.current = true;

        const poll = async () => {
            if (document.hidden) return;
            if (isFetchingRef.current) return;
            if (!mountedRef.current) return;

            // Enforce minimum gap between polls
            const now = Date.now();
            if (now - lastPollTimeRef.current < MIN_POLL_GAP) return;

            isFetchingRef.current = true;
            lastPollTimeRef.current = now;

            try {
                await fetchUnreadCount();
            } finally {
                isFetchingRef.current = false;
            }
        };

        // Initial fetch (slight delay to avoid StrictMode double-fire)
        const initTimeout = setTimeout(poll, 500);

        // Setup interval
        intervalRef.current = setInterval(poll, POLL_INTERVAL);

        // Visibility listener — debounced via MIN_POLL_GAP
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                poll();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            mountedRef.current = false;
            clearTimeout(initTimeout);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user?.id, fetchUnreadCount]);

    // Actions
    const markRead = async (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await markNotificationRead(id);
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        if (user) await markAllNotificationsRead(user.id);
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markRead,
        markAllRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
