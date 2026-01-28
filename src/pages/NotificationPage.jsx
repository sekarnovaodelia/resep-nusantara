import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/interactionService';

const NotificationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        if (user) {
            setLoading(true);
            try {
                const data = await fetchNotifications(user.id);
                setNotifications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadNotifications();
    }, [user, navigate]);

    const handleMarkAllRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await markAllNotificationsRead(user.id);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            // Optimistic update locally
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            // Background update
            markNotificationRead(notification.id);
        }

        // Navigate based on type
        if (notification.entity_type === 'recipe') {
            navigate(`/recipe/${notification.entity_id}`);
        } else if (notification.entity_type === 'profile') {
            navigate(`/public-profile?id=${notification.actor_id}`);
        }
    };

    const getNotificationText = (notification) => {
        const actorName = notification.actor?.full_name || 'Seseorang';
        const recipeTitle = notification.recipe?.title || 'resep Anda'; // Assuming recipe data is joined or available

        // Helper to wrap bold text
        const Bold = ({ children }) => <span className="font-bold">{children}</span>;
        const Primary = ({ children }) => <span className="font-semibold text-primary">{children}</span>;

        switch (notification.type) {
            case 'comment':
                return (
                    <>
                        <Bold>{actorName}</Bold> mengomentari <Primary>{recipeTitle}</Primary>
                        {notification.metadata?.comment_text && (
                            <span className="text-gray-500 dark:text-gray-400 italic"> "{notification.metadata.comment_text}"</span>
                        )}
                    </>
                );
            case 'reply':
                return <><Bold>{actorName}</Bold> membalas komentar Anda.</>;
            case 'like':
                return <><Bold>{actorName}</Bold> menyukai resep Anda <Primary>{recipeTitle}</Primary></>;
            case 'follow':
                return <><Bold>{actorName}</Bold> mulai mengikuti Anda</>;
            case 'upload':
                return <><Bold>{actorName}</Bold> mengupload resep baru.</>;
            default:
                return <>Ada notifikasi baru dari <Bold>{actorName}</Bold>.</>;
        }
    };

    const getTimeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        if (diffInSeconds < 172800) return 'Kemarin';
        return date.toLocaleDateString('id-ID');
    };

    // Grouping Logic
    const groupedNotifications = {
        today: [],
        yesterday: [],
        older: []
    };

    notifications.forEach(n => {
        const date = new Date(n.created_at);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (notificationDate.getTime() === today.getTime()) {
            groupedNotifications.today.push(n);
        } else if (notificationDate.getTime() === yesterday.getTime()) {
            groupedNotifications.yesterday.push(n);
        } else {
            groupedNotifications.older.push(n);
        }
    });

    const renderNotificationItem = (notification) => {
        const actorAvatar = notification.actor?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.actor?.full_name || 'User')}&background=random`;
        const recipeImage = notification.recipe?.image_url; // Assuming this might be available in typical join, otherwise null

        return (
            <div
                key={notification.id}
                className="group flex items-start gap-4 p-3 rounded-lg hover:bg-[#fcfaf8] dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative"
                onClick={() => handleNotificationClick(notification)}
            >
                {/* Unread Dot */}
                {!notification.is_read && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 size-2 bg-primary rounded-full"></div>
                )}

                {/* Avatar */}
                <div
                    className="bg-center bg-no-repeat bg-cover rounded-lg size-12 shrink-0 ml-2"
                    style={{ backgroundImage: `url("${actorAvatar}")` }}
                ></div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
                    <p className="text-text-main dark:text-gray-200 text-base leading-snug">
                        {getNotificationText(notification)}
                    </p>
                    <span className="text-text-secondary dark:text-gray-500 text-xs font-medium">
                        {getTimeAgo(notification.created_at)}
                    </span>
                </div>

                {/* Right Action/Image */}
                <div className="shrink-0">
                    {(notification.type === 'like' || notification.type === 'comment' || notification.type === 'upload') && recipeImage ? (
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-lg size-14 border border-border-light dark:border-gray-700 group-hover:border-primary/30 transition-colors"
                            style={{ backgroundImage: `url("${recipeImage}")` }}
                        ></div>
                    ) : notification.type === 'follow' ? (
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary dark:hover:bg-primary/20 text-sm font-bold transition-all">
                            Lihat
                        </button>
                    ) : (
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors mt-2">chevron_right</span>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="flex-grow w-full max-w-[900px] mx-auto px-4 py-8 md:py-12 pb-24">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Notifikasi</h1>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Pantau interaksi terbaru di dapur sosialmu.</p>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-primary hover:text-orange-700 dark:hover:text-orange-400 text-sm font-bold transition-colors whitespace-nowrap self-start md:self-auto"
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>

            {/* Notification Card Container */}
            <div className="bg-white dark:bg-[#1a1c20] rounded-xl shadow-sm border border-border-light dark:border-gray-800 overflow-hidden">

                {/* Empty State */}
                {notifications.length === 0 && (
                    <div className="p-10 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">notifications_off</span>
                        <p className="text-text-secondary font-medium">Belum ada notifikasi baru</p>
                    </div>
                )}

                {/* Hari Ini */}
                {groupedNotifications.today.length > 0 && (
                    <div className="p-6 pb-2">
                        <h3 className="text-sm font-bold text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Hari Ini</h3>
                        {groupedNotifications.today.map(renderNotificationItem)}
                    </div>
                )}

                {/* Divider if needed */}
                {groupedNotifications.today.length > 0 && (groupedNotifications.yesterday.length > 0 || groupedNotifications.older.length > 0) && (
                    <div className="h-px bg-border-light dark:bg-gray-800 mx-6 my-2"></div>
                )}

                {/* Kemarin */}
                {groupedNotifications.yesterday.length > 0 && (
                    <div className="p-6 pt-2">
                        <h3 className="text-sm font-bold text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Kemarin</h3>
                        {groupedNotifications.yesterday.map(renderNotificationItem)}
                    </div>
                )}

                {/* Divider if needed */}
                {(groupedNotifications.today.length > 0 || groupedNotifications.yesterday.length > 0) && groupedNotifications.older.length > 0 && (
                    <div className="h-px bg-border-light dark:bg-gray-800 mx-6 my-2"></div>
                )}

                {/* Lainnya (Older) */}
                {groupedNotifications.older.length > 0 && (
                    <div className="p-6 pt-2">
                        <h3 className="text-sm font-bold text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Lama</h3>
                        {groupedNotifications.older.map(renderNotificationItem)}
                    </div>
                )}

                {/* Footer hint */}
                {notifications.length > 0 && (
                    <div className="bg-[#fcfaf8] dark:bg-gray-800/30 p-4 text-center border-t border-border-light dark:border-gray-800">
                        <p className="text-sm text-text-secondary dark:text-gray-500">Itu saja notifikasi untuk saat ini. <a href="/?search=" className="text-primary font-semibold hover:underline">Jelajahi resep baru</a></p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default NotificationPage;
