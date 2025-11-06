import axios from 'axios';

// 1. Define API URL
// We'll use the .env variable, defaulting to your backend server
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 2. Create Axios Instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 3. API Interceptor to Add Token
// This runs before *every* request and adds the auth token
// This is your frontend "security guard"
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage directly
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;