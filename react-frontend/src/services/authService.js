import api, { getBackendType } from './api';
import {jwtDecode} from 'jwt-decode';

// Register a new user
export const register = async (credentials) => {
    try {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Login user
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);

        // Save token and user data
        const { token, user } = response.data;

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get current user profile
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/profile');

        // Update stored user data with the latest
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));

        return getBackendType() === 'node' ? response.data.user : response.data;
    } catch (error) {
        throw error;
    }
};

// Check if token is valid
export const isTokenValid = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
};

// Get user from localStorage
export const getStoredUser = () => {
    const user = localStorage.getItem('user');

    if (user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            return null;
        }
    }

    return null;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};