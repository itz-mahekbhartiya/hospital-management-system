import api from './api';

/**
 * Gets a list of all doctors.
 */
export const getDoctors = async () => {
    const res = await api.get('/users/doctors');
    return res.data; // Returns array of doctor objects
};


/**
 * Gets a list of all users (for Admin).
 */
export const getAllUsers = async () => {
    const res = await api.get('/users');
    return res.data; // Returns array of all users
};

/**
 * Creates a new user (for Admin).
 * @param {object} userData - { name, email, password, role, specialty }
 */
export const createUser = async (userData) => {
    const res = await api.post('/users', userData);
    return res.data; // Returns the new user object
};