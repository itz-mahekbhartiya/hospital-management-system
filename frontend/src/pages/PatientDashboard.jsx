import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Calendar, FileText, PlusCircle } from 'lucide-react';


import MyAppointments from '../components/MyAppointments';
import MedicalHistory from '../components/MedicalHistory';
import BookAppointment from '../components/BookAppointment';

// Tab mapping
const TABS = {
    MY_APPOINTMENTS: 'My Appointments',
    BOOK_APPOINTMENT: 'Book Appointment',
    MEDICAL_HISTORY: 'Medical History',
};

const PatientDashboard = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState(TABS.MY_APPOINTMENTS);

    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.MY_APPOINTMENTS:
                return <MyAppointments />;
            case TABS.BOOK_APPOINTMENT:
                return <BookAppointment onBookingSuccess={() => setActiveTab(TABS.MY_APPOINTMENTS)} />;
            case TABS.MEDICAL_HISTORY:
                return <MedicalHistory />;
            default:
                return <MyAppointments />;
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name}
            </h1>
            <p className="mt-1 text-gray-600">
                Here you can manage your appointments and view your medical history.
            </p>

            {/* Tab Navigation  */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.MY_APPOINTMENTS
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.MY_APPOINTMENTS)}
                    >
                        <Calendar className="w-5 h-5" />
                        My Appointments
                    </button>
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.BOOK_APPOINTMENT
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.BOOK_APPOINTMENT)}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Book Appointment
                    </button>
                    <button
                        className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 ${
                            activeTab === TABS.MEDICAL_HISTORY
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(TABS.MEDICAL_HISTORY)}
                    >
                        <FileText className="w-5 h-5" />
                        Medical History
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default PatientDashboard;