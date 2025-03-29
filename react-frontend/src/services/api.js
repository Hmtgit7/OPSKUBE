// src/services/api.js
import axios from 'axios';

// Get backend configuration from environment variables or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BACKEND = process.env.REACT_APP_API_BACKEND; // 'node' or 'java'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
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
    (error) => {
        console.error('API request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log detailed error information for debugging
        console.error('API response error:', error);

        // Handle token expiration
        if (error.response && error.response.status === 401) {
            console.warn('Authentication error detected, clearing credentials');

            // Clear local storage if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login page if not already there
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }

        // Extract error message from response
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Something went wrong. Please try again.';

        return Promise.reject({
            message: errorMessage,
            errors: error.response?.data?.errors,
            status: error.response?.status
        });
    }
);

// Get current backend type (used for conditional handling of responses)
export const getBackendType = () => {
    return API_BACKEND;
};

// Function to check if API is available (health check)
export const checkApiHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('API health check failed:', error);
        throw error;
    }
};

export default api;