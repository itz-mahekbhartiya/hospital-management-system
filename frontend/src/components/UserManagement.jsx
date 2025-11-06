import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api/userApi';
import { Users, Plus } from 'lucide-react';
import AddUserModal from './AddUserModal'; // We'll create this next

const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                user.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
            }`}>
                {user.role}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.specialty || 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
    </tr>
);

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            setError('Could not fetch users.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onUserAdded = (newUser) => {
        setUsers(prevUsers => [newUser, ...prevUsers]); // Add new user to top
        setIsModalOpen(false); // Close modal
    };

    if (isLoading) return <div className="text-center p-4">Loading users...</div>;
    if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New User
                </button>
            </div>
            
            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => <UserRow key={user._id} user={user} />)}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddUserModal 
                    onClose={() => setIsModalOpen(false)} 
                    onUserAdded={onUserAdded} 
                />
            )}
        </div>
    );
};

export default UserManagement;