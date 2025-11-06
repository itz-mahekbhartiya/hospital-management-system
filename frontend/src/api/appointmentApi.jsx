import api from './api';

/**
 * Gets all appointments for the logged-in user.
 */
export const getMyBookings = async () => {
    const res = await api.get('/appointments/my');
    return res.data; // Returns array of appointments
};

/**
 * Creates a new appointment.
 * @param {string} doctor - The doctor's ID
 * @param {string} date - The ISO date string
 * @param {string} reason - The reason for booking
 */
export const bookAppointment = async (doctor, date, reason) => {
    const res = await api.post('/appointments', { doctor, date, reason });
    return res.data; // Returns the new appointment
};

/**
 * Cancels an appointment.
 * @param {string} id - The appointment ID
 */
export const cancelBooking = async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data; // Returns { msg: '... ' }
};


/**
 * Updates an appointment's status (by Doctor).
 * @param {string} id - The appointment ID
 * @param {string} status - The new status ('CONFIRMED', 'COMPLETED', 'CANCELLED')
 */
export const updateBookingStatus = async (id, status) => {
    const res = await api.put(`/appointments/${id}/status`, { status });
    return res.data; // Returns the updated appointment
};


/**
 * Gets all appointments in the system (for Admin).
 */
export const getAllAppointments = async () => {
    const res = await api.get('/appointments/all');
    return res.data; // Returns array of all appointments
};