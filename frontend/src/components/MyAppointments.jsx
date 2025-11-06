import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../api/appointmentApi';
import { AlertTriangle, CheckCircle, Clock, X, Trash2 } from 'lucide-react';

const AppointmentCard = ({ appt, onCancel }) => {
    
    const getStatusChip = (status) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="flex items-center text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </span>
                );
            case 'CONFIRMED':
                return (
                    <span className="flex items-center text-xs font-medium text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="flex items-center text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        Completed
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="flex items-center text-xs font-medium text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full">
                        <X className="w-3 h-3 mr-1" /> Cancelled
                    </span>
                );
            default:
                return null;
        }
    };

    const canCancel = appt.status === 'PENDING';

    return (
        <li className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <p className="text-lg font-semibold text-indigo-700">
                        {new Date(appt.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    </p>
                    <p className="text-gray-600 mt-1">
                        <span className="font-medium">Doctor:</span> {appt.doctor.name} ({appt.doctor.specialty})
                    </p>
                    <p className="text-gray-600 mt-1">
                        <span className="font-medium">Reason:</span> {appt.reason}
                    </p>
                </div>
                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                    {getStatusChip(appt.status)}
                    {canCancel && (
                        <button
                            onClick={() => onCancel(appt._id)}
                            className="flex items-center text-sm text-red-600 hover:text-red-800 mt-3"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancel Appointment
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};

const MyAppointments = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (error) {
            setError('Could not fetch appointments.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }
        try {
            await cancelBooking(id);
            
            fetchBookings(); 
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to cancel appointment.');
        }
    };

    if (isLoading) return <div className="text-center p-4">Loading appointments...</div>;
    if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Appointments</h2>
            {bookings.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You have no appointments scheduled.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {bookings.map(appt => (
                        <AppointmentCard key={appt._id} appt={appt} onCancel={handleCancel} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyAppointments;