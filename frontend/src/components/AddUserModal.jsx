import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUser } from '../api/userApi';
import { X, UserPlus } from 'lucide-react';

const AddUserModal = ({ onClose, onUserAdded }) => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [apiError, setApiError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Watch the 'role' field to conditionally show the 'specialty' field
    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const newUser = await createUser(data);
            onUserAdded(newUser); // Pass new user back to parent
            reset();
        } catch (error) {
            setApiError(error.response?.data?.msg || 'Failed to create user.');
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {apiError && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">{apiError}</div>}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                            {...register('password', { 
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                                {...register('role', { required: 'Role is required' })}
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {selectedRole === 'DOCTOR' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                                <select
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                                    {...register('specialty', { required: 'Specialty is required for doctors' })}
                                    defaultValue="OPD"
                                >
                                    <option value="OPD">OPD</option>
                                    <option value="Skin care">Skin care</option>
                                    <option value="ENT">ENT</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        {isLoading ? 'Creating User...' : 'Create User'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;