import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getDoctors } from '../api/userApi';
import { bookAppointment } from '../api/appointmentApi';
import { Send } from 'lucide-react';

const BookAppointment = ({ onBookingSuccess }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [apiSuccess, setApiSuccess] = useState(null);

    // Fetch doctors when component loads
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);
            } catch (error) {
                setApiError('Could not fetch doctors.');
            }
        };
        fetchDoctors();
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError(null);
        setApiSuccess(null);
        try {
            // Combine date and time into a single ISO string
            const appointmentDate = new Date(`${data.date}T${data.time}:00`);
            
            await bookAppointment(data.doctor, appointmentDate.toISOString(), data.reason);
            setApiSuccess('Appointment booked successfully! The doctor will confirm it soon.');
            reset();
            
            // Call the success callback to switch tabs
            if (onBookingSuccess) {
                setTimeout(() => onBookingSuccess(), 2000); // Switch after 2s
            }
        } catch (error) {
            setApiError(error.response?.data?.msg || 'Failed to book appointment.');
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Book a New Appointment</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {apiError && <div className="p-3 text-red-800 bg-red-100 rounded-md">{apiError}</div>}
                {apiSuccess && <div className="p-3 text-green-800 bg-green-100 rounded-md">{apiSuccess}</div>}

                <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                        Select Doctor
                    </label>
                    <select
                        id="doctor"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...register('doctor', { required: 'Please select a doctor' })}
                    >
                        <option value="">-- Select a Doctor --</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>
                                {doc.name} ({doc.specialty})
                            </option>
                        ))}
                    </select>
                    {errors.doctor && <p className="mt-1 text-sm text-red-600">{errors.doctor.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            min={new Date().toISOString().split('T')[0]} // No past dates
                            {...register('date', { required: 'Please select a date' })}
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
                        <input
                            id="time"
                            type="time"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            {...register('time', { required: 'Please select a time' })}
                        />
                        {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason for Appointment
                    </label>
                    <textarea
                        id="reason"
                        rows="4"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...register('reason', { 
                            required: 'Please provide a reason',
                            maxLength: { value: 500, message: 'Reason is too long' }
                        })}
                    />
                    {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                    <Send className="w-5 h-5 mr-2" />
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;