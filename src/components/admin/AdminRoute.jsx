import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Secure wrapper for Admin routes.
 * Checks authentication status and user role.
 */
const AdminRoute = ({ children }) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-sub-light dark:text-text-sub-dark font-medium animate-pulse">
                        Memverifikasi akses...
                    </p>
                </div>
            </div>
        );
    }

    // 1. Check if authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if admin
    // Note: 'role' must be fetched in profile. 
    // If profile is still loading but user exists, we might need to wait, 
    // but AuthContext 'loading' usually covers the initial profile fetch.
    if (!profile || profile.role !== 'admin') {
        console.warn('🔴 Access denied: User is not an admin', { userId: user.id, role: profile?.role });
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
