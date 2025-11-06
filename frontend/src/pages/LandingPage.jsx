import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, UserPlus, LogIn } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
            <header className="text-center">
                <Stethoscope className="w-24 h-24 text-indigo-600 mx-auto" />
                <h1 className="text-5xl font-extrabold text-gray-900 mt-4">
                    Hospital Management System
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                    Your Health, Our Priority.
                </p>
            </header>

            <main className="mt-16">
                <div className="flex flex-col md:flex-row gap-6">
                    <Link
                        to="/login"
                        className="flex items-center justify-center w-64 px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        <LogIn className="w-6 h-6 mr-3" />
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center justify-center w-64 px-8 py-4 text-lg font-medium text-indigo-700 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 border border-indigo-200"
                    >
                        <UserPlus className="w-6 h-6 mr-3" />
                        Register
                    </Link>
                </div>
            </main>

            <footer className="absolute bottom-8 text-gray-500">
                &copy; {new Date().getFullYear()} HMS Project. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;