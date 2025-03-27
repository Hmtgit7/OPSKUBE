import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api'||'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message || 'Something went wrong';
        return Promise.reject({ message, errors: error.response?.data?.errors });
    }
);

export default api;