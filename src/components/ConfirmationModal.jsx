import React, { useEffect } from 'react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya',
    cancelText = 'Batal',
    isDanger = false
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-border-light dark:border-border-dark">
                <div className="text-center mb-6">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-primary/10 text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-2xl">
                            {isDanger ? 'warning' : 'info'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-text-secondary dark:text-gray-400 text-sm">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark font-semibold text-text-main dark:text-gray-300 hover:bg-background-light dark:hover:bg-accent-dark transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white shadow-sm transition-all active:scale-95 ${isDanger
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
