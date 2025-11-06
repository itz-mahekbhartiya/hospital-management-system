import api from './api';

/**
 * Registers a new user.
 */
export const registerUser = async (name, email, password, role) => {
    const res = await api.post('auth/register', { name, email, password, role });
    return res.data; // Returns { token, user }
};

/**
 * Logs in an existing user.
 */
export const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // Returns { token, user }
};

/**
 * Gets the currently logged-in user.
 */
export const getMe = async () => {
    const res = await api.get('/auth/me');
    return res.data; // Returns user object
};
