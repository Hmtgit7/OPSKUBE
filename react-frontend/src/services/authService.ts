import api from './api';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User
} from '../types';

// Register a new user
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/profile');
    return response.data.user;
};

// Logout (client-side only)
export const logout = (): void => {
    localStorage.removeItem('token');
};

// Set JWT token in localStorage
export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

// Get JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};