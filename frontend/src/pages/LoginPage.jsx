import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogIn, Stethoscope } from 'lucide-react';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, isAuthenticated } = useAuthStore();
    const [authError, setAuthError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setAuthError(null);
        setIsLoading(true);
        try {
            await login(data.email, data.password);
        } catch (error) {
            setAuthError(error.message);
        }
        setIsLoading(false);
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
                    <Stethoscope className="w-12 h-12 text-indigo-600" />
                    <h2 className="mt-4 text-3xl font-bold text-center text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {authError && (
                        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
                            {authError}
                        </div>
                    )}
                    
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
                <p className="text-sm text-center text-gray-600">
                    <Link to="/" className="text-xs text-gray-500 hover:text-gray-700">
                        Back to Welcome Page
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;