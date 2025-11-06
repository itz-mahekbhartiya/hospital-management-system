import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import the Zustand store
import { useAuthStore } from './store/authStore';

// --- Pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Components ---
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// --- Placeholder Dashboards (Create these!) ---
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

/**
 * A helper component to redirect users *away* from public pages
 * (like login) if they are already authenticated.
 */
const PublicRoute = ({ children }) => {
    // Get state from Zustand
    const { isAuthenticated, isLoading } = useAuthStore();
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

/**
 * A helper component to redirect users *to* their specific dashboard
 * when they land on the root route ('/').
 */
const DashboardRedirect = () => {
    // Get state from Zustand
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case 'ADMIN':
            return <Navigate to="/admin/dashboard" replace />;
        case 'DOCTOR':
            return <Navigate to="/doctor/dashboard" replace />;
        case 'PATIENT':
            return <Navigate to="/patient/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- PUBLIC ROUTES ---
                  These are wrapped in <PublicRoute> so that logged-in
                  users are automatically redirected to their dashboard.
                */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                {/* --- PROTECTED ROUTES ---
                  These routes are only accessible to logged-in users.
                  The <ProtectedRoute> component checks for a valid token.
                */}
                <Route element={<ProtectedRoute />}>
                    {/* The <MainLayout> adds the Navbar and footer */}
                    <Route element={<MainLayout />}>
                        {/* Root path for logged-in users */}
                        <Route path="/dashboard" element={<DashboardRedirect />} />

                        {/* Role-Specific Dashboards */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['DOCTOR']}>
                                    <DoctorDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <PatientDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Route>

                {/* --- CATCH-ALL --- */}
                {/* If no route matches, redirect to the root.
                    <PublicRoute> will handle sending them to /login
                    <ProtectedRoute> will handle sending them to /dashboard
                */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;