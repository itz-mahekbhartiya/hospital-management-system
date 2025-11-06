import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser, isAuthenticated } = useAuthStore();
    const [authError, setAuthError] = useState(null);

    const onSubmit = async (data) => {
        setAuthError(null);
        if (data.password !== data.confirmPassword) {
            setAuthError('Passwords do not match');
            return;
        }
        try {
            console.log(data.name, data.email, data.password, data.role)
            await registerUser(data.name, data.email, data.password, data.role);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    Create Your Account
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {authError && (
                        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
                            {authError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('password', { required: 'Password is required', minLength: 6 })}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">Password must be at least 6 characters.</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('confirmPassword', { required: 'Please confirm your password' })}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Register as
                        </label>
                        <select
                            id="role"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('role', { required: 'Please select a role' })}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="ADMIN">Admin</option> 
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;