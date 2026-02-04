import React, { useState } from 'react';
import { useAdminRecipes } from '../hooks/useAdminRecipes';
import RecipeRow from '../components/admin/RecipeRow';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const { recipes, loading, error, updateStatus } = useAdminRecipes(activeTab);

    const tabs = [
        { id: 'pending', label: 'Pending Review' },
        { id: 'published', label: 'Published' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'draft', label: 'Drafts' },
    ];

    const handleApprove = (id) => updateStatus(id, 'published');
    const handleReject = (id) => updateStatus(id, 'rejected');

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-text-sub-light dark:text-text-sub-dark">
                        Manage and moderate community recipes.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark p-1 rounded-xl mb-6 w-fit overflow-x-auto border border-border-light dark:border-border-dark">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                            ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-text-sub-light dark:text-text-sub-dark hover:text-text-main-light dark:hover:text-text-main-dark hover:bg-gray-100 dark:hover:bg-[#3e3228]'
                                }
                        `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Content */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-b border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="p-12 text-center text-text-sub-light dark:text-text-sub-dark">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                            <p>No recipes found in {activeTab}.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                                <thead className="bg-gray-50 dark:bg-[#1e1611]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider">
                                            Recipe
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider">
                                            Author
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                    {recipes.map((recipe) => (
                                        <RecipeRow
                                            key={recipe.id}
                                            recipe={recipe}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
