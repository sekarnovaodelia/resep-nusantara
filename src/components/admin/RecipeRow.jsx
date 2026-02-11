import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const RecipeRow = ({ recipe, onApprove, onReject, onPreview, onDelete }) => {
    const {
        id,
        title,
        created_at,
        status,
        profiles
    } = recipe;

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
                {status ? status.toUpperCase() : 'UNKNOWN'}
            </span>
        );
    };

    // Strict UI logic for actions
    const canApprove = status === 'pending' || status === 'rejected';
    const canReject = status === 'pending' || status === 'published';

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2018] transition-colors">
            {/* Title & Date */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <button
                        onClick={() => onPreview(id)}
                        className="text-sm font-medium text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors hover:underline text-left w-fit"
                    >
                        {title}
                    </button>
                    <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        {format(new Date(created_at), 'd MMMM yyyy, HH:mm', { locale: idLocale })}
                    </span>
                </div>
            </td>

            {/* Author */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {profiles?.avatar_url ? (
                            <img src={getOptimizedImageUrl(profiles.avatar_url, { width: 64, height: 64 })} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                                {profiles?.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm text-text-main-light dark:text-text-main-dark">
                            {profiles?.username || 'Unknown'}
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(status)}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    {canApprove && (
                        <button
                            onClick={() => onApprove(id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-bold transition-colors shadow-sm"
                        >
                            Approve
                        </button>
                    )}

                    {canReject && (
                        <button
                            onClick={() => onReject(id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-bold transition-colors shadow-sm"
                        >
                            Reject
                        </button>
                    )}

                    <button
                        onClick={() => onPreview(id)}
                        className="bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-300 px-3 py-1 rounded-md text-xs font-bold transition-colors shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Preview
                    </button>

                    {status === 'rejected' && (
                        <button
                            onClick={() => onDelete(id)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                            title="Hapus Permanen"
                        >
                            <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default RecipeRow;
