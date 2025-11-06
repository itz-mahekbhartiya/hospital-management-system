import React from 'react';
import { Outlet, Link } from 'react-router-dom';
// Import the Zustand store
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Stethoscope } from 'lucide-react';

const MainLayout = () => {
    // Get state and actions from Zustand
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen flex flex-col">
            {/* --- Navbar --- */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/dashboard" className="flex items-center text-2xl font-bold text-indigo-600">
                            <Stethoscope className="w-8 h-8 mr-2" />
                            HMS
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block text-gray-700">
                                <User className="w-5 h-5 inline-block mr-1 relative -top-px" />
                                {user?.name} 
                                <span className="text-gray-500 text-sm ml-1">({user?.role})</span>
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Page Content --- */}
            <main className="flex-grow bg-gray-100 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* The specific page (e.g., AdminDashboard) will be rendered here */}
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default MainLayout;