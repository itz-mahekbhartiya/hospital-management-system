import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import the Zustand store
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Placeholder Dashboards
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';


const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};


const DashboardRedirect = () => {
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

                
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardRedirect />} />

                        
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

                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;