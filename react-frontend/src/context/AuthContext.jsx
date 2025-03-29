import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
    register as registerService,
    login as loginService,
    getStoredUser,
    isTokenValid,
    logout as logoutService
} from '../services/authService';

// Initial state
const initialState = {
    user: getStoredUser(),
    isAuthenticated: isTokenValid(),
    isLoading: false,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    INIT_START: 'INIT_START',
    INIT_SUCCESS: 'INIT_SUCCESS',
    INIT_FAILURE: 'INIT_FAILURE',
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOGOUT: 'LOGOUT',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.INIT_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case AUTH_ACTIONS.INIT_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.INIT_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Register function
    const register = useCallback(async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.REGISTER_START });

        try {
            const response = await registerService(credentials);
            const userData = response.user;

            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: userData
            });

            return userData;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: error.message
            });

            throw error;
        }
    }, []);

    // Login function
    const login = useCallback(async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await loginService(credentials);
            const userData = response.user;

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: userData
            });

            return userData;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message
            });

            throw error;
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        logoutService();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }, []);

    // Context value
    const value = {
        state,
        register,
        login,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};