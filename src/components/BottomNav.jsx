import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const BottomNav = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { unreadCount } = useNotifications();

    const navItems = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Planner', icon: 'event_note', path: '/planner' },
        { label: 'Upload', icon: 'add', path: '/upload-recipe', isFab: true },
        { label: 'Komunitas', icon: 'group', path: '/community' },
        { label: 'Notifikasi', icon: 'notifications', path: '/notifications', badge: unreadCount > 0 },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-border-light dark:border-border-dark lg:hidden z-40 flex items-center justify-between px-2 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        item.isFab
                            ? `relative -top-6 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 ${isActive
                                ? 'bg-primary text-white scale-110 shadow-orange-500/40'
                                : 'bg-primary text-white hover:scale-105 shadow-orange-500/30'
                            }`
                            : `flex flex-col items-center justify-center flex-1 gap-1 h-full transition-all duration-300 ${isActive
                                ? 'text-primary'
                                : 'text-text-secondary dark:text-gray-400 opacity-70 hover:opacity-100'
                            }`
                    }
                >
                    {({ isActive }) => (
                        item.isFab ? (
                            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                        ) : (
                            <div className="relative flex flex-col items-center">
                                <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'scale-110 font-bold' : 'scale-100'}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {item.label}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
                                )}

                                {/* Notification Badge */}
                                {item.badge && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                                )}
                            </div>
                        )
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
