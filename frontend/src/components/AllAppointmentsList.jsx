import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../api/appointmentApi';
import { Clock, CheckCircle, X } from 'lucide-react';

const getStatusChip = (status) => {
    switch (status) {
        case 'PENDING':
            return <span className="flex items-center text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3 mr-1" />Pending</span>;
        case 'CONFIRMED':
            return <span className="flex items-center text-xs font-medium text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</span>;
        case 'COMPLETED':
            return <span className="flex items-center text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">Completed</span>;
        case 'CANCELLED':
            return <span className="flex items-center text-xs font-medium text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full"><X className="w-3 h-3 mr-1" />Cancelled</span>;
        default: return null;
    }
};

const AllAppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllAppointments();
                setAppointments(data);
            } catch (error) {
                setError('Could not fetch appointments.');
            }
            setIsLoading(false);
        };
        fetchAppointments();
    }, []);

    if (isLoading) return <div className="text-center p-4">Loading all appointments...</div>;
    if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All System Appointments</h2>
            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map(appt => (
                            <tr key={appt._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {new Date(appt.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.patient.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.doctor.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(appt.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllAppointmentsList;