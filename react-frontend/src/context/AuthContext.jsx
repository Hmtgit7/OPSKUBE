import { createContext, useContext, useReducer, useEffect } from 'react';
import {
    register as registerService,
    login as loginService,
    getCurrentUser,
    getStoredUser,
    isTokenValid,
    logout as logoutService
} from '../services/authService';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
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

    // Check if user is already authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            dispatch({ type: AUTH_ACTIONS.INIT_START });

            try {
                // Check if token is valid
                if (isTokenValid()) {
                    // Try to get fresh user data from API
                    try {
                        const userData = await getCurrentUser();
                        dispatch({
                            type: AUTH_ACTIONS.INIT_SUCCESS,
                            payload: userData
                        });
                    } catch (error) {
                        // If API call fails, use stored user data
                        const storedUser = getStoredUser();
                        if (storedUser) {
                            dispatch({
                                type: AUTH_ACTIONS.INIT_SUCCESS,
                                payload: storedUser
                            });
                        } else {
                            dispatch({ type: AUTH_ACTIONS.INIT_FAILURE });
                        }
                    }
                } else {
                    dispatch({ type: AUTH_ACTIONS.INIT_FAILURE });
                }
            } catch (error) {
                dispatch({ type: AUTH_ACTIONS.INIT_FAILURE });
            }
        };

        initAuth();
    }, []);

    // Register function
    const register = async (credentials) => {
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
    };

    // Login function
    const login = async (credentials) => {
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
    };

    // Logout function
    const logout = () => {
        logoutService();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

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