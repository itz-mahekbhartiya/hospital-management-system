import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Import the Zustand store
import { useAuthStore } from '../store/authStore';

/**
 * A wrapper for routes that require authentication.
 * @param {object} props
 * @param {string[]} [props.allowedRoles] - Optional array of roles that can access this route.
 * @param {React.ReactNode} [props.children] - Optional children to render (for wrapper routes)
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    // Get state from Zustand
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Logged in, but does not have the correct role
        // Redirect to their default dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // --- THIS IS THE FIX ---
    // If this component is used as a wrapper (e.g., <ProtectedRoute><Page/></ProtectedRoute>)
    // then 'children' will exist, and we should render them.
    //
    // If it's used as a layout route (e.g., <Route element={<ProtectedRoute />} />)
    // then 'children' will be null, and we should render the <Outlet /> for nested routes.
    return children ? children : <Outlet />;
};

export default ProtectedRoute;