// src/services/authService.js
import api, { getBackendType } from './api';
import { jwtDecode } from 'jwt-decode';

// Register a new user
export const register = async (credentials) => {
    try {
        const response = await api.post('/auth/register', credentials);

        // Save token and user data if they exist in the response
        const { token, user } = response.data;

        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Login user
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);

        // Save token and user data
        const { token, user } = response.data;

        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            console.error('Login response missing token or user data:', response.data);
            throw new Error('Invalid login response from server');
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Get current user profile
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/profile');

        // Update stored user data with the latest
        const userData = getBackendType() === 'node' ? response.data.user : response.data;
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.error('Get current user error:', error);
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
        console.error('Token validation error:', error);
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
            console.error('Error parsing stored user:', error);
            return null;
        }
    }

    return null;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};