import React from 'react';
import { Link } from 'react-router-dom';

const UserListModal = ({ isOpen, onClose, title, users, emptyMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-surface-dark sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-text-main dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-text-sub dark:text-gray-400">close</span>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {users.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {users.map((user) => (
                                <Link
                                    key={user.id}
                                    to={`/public-profile?id=${user.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-700"
                                        style={{ backgroundImage: `url("${user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=EA6A12&color=fff`}")` }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-text-main dark:text-white truncate group-hover:text-primary transition-colors">
                                            {user.full_name}
                                        </h4>
                                        <p className="text-sm text-text-sub dark:text-gray-400 truncate">@{user.username}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <span className="material-symbols-outlined text-3xl">group_off</span>
                            </div>
                            <p className="text-text-sub dark:text-gray-400 font-medium">{emptyMessage || 'Belum ada pengguna.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListModal;
