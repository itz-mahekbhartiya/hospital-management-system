import { create } from 'zustand';
import { getMe, loginUser, registerUser } from '../api/authApi';


const initialToken = localStorage.getItem('token') || null;

export const useAuthStore = create((set, get) => ({

    user: null,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: true, 


    loadUser: async () => {
        const token = get().token;
        if (!token) {
            return set({ isLoading: false, isAuthenticated: false, user: null });
        }

        try {
            const userData = await getMe();
            set({
                isAuthenticated: true,
                user: userData,
                isLoading: false
            });
        } catch (error) {
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
            throw new Error(error.response?.data?.msg || 'Registration failed');
        }
    },


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
            throw new Error(error.response?.data?.msg || 'Login failed');
        }
    },


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

useAuthStore.getState().loadUser();