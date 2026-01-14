import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 ${isActive
            ? 'text-primary'
            : 'text-text-secondary dark:text-gray-400 opacity-70 hover:opacity-100'
        }`;

    const iconClass = (isActive) =>
        `material-symbols-outlined transition-all duration-300 ${isActive ? 'scale-110 font-bold' : 'scale-100'}`;

    const navItems = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Planner', icon: 'event_note', path: '/planner' },
        { label: 'Community', icon: 'group', path: '/community' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-border-light dark:border-border-dark lg:hidden z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
            {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                    {({ isActive }) => (
                        <>
                            <span className={iconClass(isActive)}>{item.icon}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-1 w-12 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(192,77,41,0.4)] animate-in slide-in-from-bottom-1 duration-300" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
