import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';


const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;