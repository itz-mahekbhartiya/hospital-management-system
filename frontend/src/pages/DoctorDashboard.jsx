import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyBookings, updateBookingStatus } from '../api/appointmentApi';
import { Clock, Check, User, ChevronRight } from 'lucide-react';


import PatientDetailsModal from '../components/PatientDetailsModal';

const DoctorDashboard = () => {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            
            const data = await getMyBookings(); 
            setAppointments(data);
        } catch (error) {
            setError('Could not fetch appointments.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateBookingStatus(id, newStatus);
            
            fetchAppointments(); 
        } catch (error) {
            setError('Failed to update status.');
        }
    };
    
    const handleViewPatient = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-4">Loading appointments...</div>;
        if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;
        if (appointments.length === 0) {
            return (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You have no appointments scheduled.</p>
                </div>
            );
        }

        return (
            <ul className="space-y-4">
                {appointments.map(appt => (
                    <li key={appt._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between">
                            
                            <div>
                                <p className="text-lg font-semibold text-indigo-700">
                                    {new Date(appt.date).toLocaleString('en-US', {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-medium">Patient:</span> {appt.patient.name}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <span className="font-medium">Reason:</span> {appt.reason}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <span className="font-medium">Status:</span> 
                                    <span className={`font-semibold ml-2 ${
                                        appt.status === 'PENDING' ? 'text-yellow-600' :
                                        appt.status === 'CONFIRMED' ? 'text-green-600' :
                                        appt.status === 'COMPLETED' ? 'text-blue-600' : 'text-red-600'
                                    }`}>
                                        {appt.status}
                                    </span>
                                </p>
                            </div>

                            
                            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 space-y-3">
                                <button
                                    onClick={() => handleViewPatient(appt)}
                                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    View Patient
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                                
                                {appt.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleStatusChange(appt._id, 'CONFIRMED')}
                                        className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Confirm
                                    </button>
                                )}
                                {appt.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => handleStatusChange(appt._id, 'COMPLETED')}
                                        className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">
                Doctor Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
                Manage appointments and patient documents for {user?.name}.
            </p>

            <div className="mt-8">
                {renderContent()}
            </div>

            
            {selectedAppointment && (
                <PatientDetailsModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    );
};

export default DoctorDashboard;