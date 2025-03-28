import axios from 'axios';

// Get backend configuration from environment variables or use default
const API_BASE_URL = 'http://localhost:5000/api';
const API_BACKEND = 'node'; // 'node' or 'java'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle token expiration
        if (error.response && error.response.status === 401) {
            // Clear local storage if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Reload the page to reset the application state
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }

        // Extract error message from response
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Something went wrong';

        return Promise.reject({ message: errorMessage, errors: error.response?.data?.errors });
    }
);

// Get current backend type (used for conditional handling of responses)
export const getBackendType = () => {
    return API_BACKEND;
};

export default api;