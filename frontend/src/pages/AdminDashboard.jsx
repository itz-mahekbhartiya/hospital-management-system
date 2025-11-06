import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Users, Calendar, FileText } from 'lucide-react';

// Import the components
import UserManagement from '../components/UserManagement';
import AllAppointmentsList from '../components/AllAppointmentsList';
import DocumentManagement from '../components/DocumentManagement';

const TABS = {
    USERS: 'User Management',
    APPOINTMENTS: 'All Appointments',
    DOCUMENTS: 'Document Management'
};

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState(TABS.USERS);

    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.USERS:
                return <UserManagement />;
            case TABS.APPOINTMENTS:
                return <AllAppointmentsList />;
            case TABS.DOCUMENTS:
                return <DocumentManagement />;
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
                Welcome, {user?.name}. You have full system access.
            </p>

            {/* --- Tab Navigation --- */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.USERS
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.USERS)}
                    >
                        <Users className="w-5 h-5" />
                        {TABS.USERS}
                    </button>
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.APPOINTMENTS
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.APPOINTMENTS)}
                    >
                        <Calendar className="w-5 h-5" />
                        {TABS.APPOINTMENTS}
                    </button>
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.DOCUMENTS
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.DOCUMENTS)}
                    >
                        <FileText className="w-5 h-5" />
                        {TABS.DOCUMENTS}
                    </button>
                </nav>
            </div>

            {/* --- Tab Content --- */}
            <div className="mt-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;