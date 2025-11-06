import { create } from 'zustand';
import { getMe, loginUser, registerUser } from '../api/authApi';

// Get the token from localStorage for the initial state
const initialToken = localStorage.getItem('token') || null;

export const useAuthStore = create((set, get) => ({
    // --- State ---
    user: null,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: true, // Start as true to check for user on load

    // --- Actions ---

    /**
     * Tries to load user from token on app start.
     */
    loadUser: async () => {
        const token = get().token;
        if (!token) {
            return set({ isLoading: false, isAuthenticated: false, user: null });
        }

        try {
            // We have a token, let's verify it with the backend
            // The api.js interceptor will automatically add the token
            const userData = await getMe();
            set({
                isAuthenticated: true,
                user: userData,
                isLoading: false
            });
        } catch (error) {
            // Token is invalid or expired
            console.error('Error loading user:', error.response?.data?.msg || error.message);
            localStorage.removeItem('token');
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    /**
     * Registers a new user.
     */
    register: async (name, email, password, role) => {
        try {
            const { token, user } = await registerUser(name, email, password, role);

            localStorage.setItem('token', token);
            set({
                isAuthenticated: true,
                user,
                token,
                isLoading: false
            });
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.msg || error.message);
            localStorage.removeItem('token');
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
            // Re-throw error so form can catch it
            throw new Error(error.response?.data?.msg || 'Registration failed');
        }
    },

    /**
     * Logs in an existing user.
     */
    login: async (email, password) => {
        try {
            const { token, user } = await loginUser(email, password);

            localStorage.setItem('token', token);
            set({
                isAuthenticated: true,
                user,
                token,
                isLoading: false
            });
        } catch (error) {
            console.error('Login failed:', error.response?.data?.msg || error.message);
            localStorage.removeItem('token');
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
            // Re-throw error so form can catch it
            throw new Error(error.response?.data?.msg || 'Login failed');
        }
    },

    /**
     * Logs out the user.
     */
    logout: () => {
        localStorage.removeItem('token');
        set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    }
}));

// --- 5. Initial User Load ---
// This is key: call loadUser() as soon as the app loads
useAuthStore.getState().loadUser();