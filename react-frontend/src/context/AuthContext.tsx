import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types';
import * as AuthService from '../services/authService';

// Action types
type AuthAction =
    | { type: 'LOGIN_REQUEST' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'REGISTER_REQUEST' }
    | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'REGISTER_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'LOAD_USER_SUCCESS'; payload: User }
    | { type: 'LOAD_USER_FAILURE' }
    | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: localStorage.getItem('token') ? true : false,
    isLoading: false,
    error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
        case 'REGISTER_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null,
            };
        case 'LOAD_USER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case 'LOAD_USER_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                isLoading: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Create auth context
type AuthContextType = {
    state: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth context provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const loadUser = async () => {
            if (state.token) {
                try {
                    const user = await AuthService.getCurrentUser();
                    dispatch({ type: 'LOAD_USER_SUCCESS', payload: user });
                } catch (error) {
                    AuthService.logout();
                    dispatch({ type: 'LOAD_USER_FAILURE' });
                }
            }
        };

        loadUser();
    }, [state.token]);

    // Login user
    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const data = await AuthService.login(credentials);
            AuthService.setToken(data.token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: data.user, token: data.token },
            });
        } catch (error: any) {
            dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
        }
    };

    // Register user
    const register = async (credentials: RegisterCredentials) => {
        dispatch({ type: 'REGISTER_REQUEST' });
        try {
            const data = await AuthService.register(credentials);
            AuthService.setToken(data.token);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { user: data.user, token: data.token },
            });
        } catch (error: any) {
            dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
        }
    };

    // Logout user
    const logout = () => {
        AuthService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider value= {{ state, login, register, logout, clearError }
}>
    { children }
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};