// src/utils/apiDebug.js
import api from '../services/api';

/**
 * Utility for debugging API endpoints directly from the browser console
 * 
 * Usage in browser console:
 * window.debugAPI.testEndpoint('/events/my-events')
 * window.debugAPI.testAllEndpoints()
 */
class ApiDebugger {
    constructor() {
        this.endpoints = {
            myEvents: [
                '/events/my-events',
                '/my-events',
                '/events?owner=me',
                '/events/user/me'
            ],
            attendingEvents: [
                '/events/attending',
                '/attending-events',
                '/events/rsvp/me',
                '/events?attending=true'
            ]
        };
    }

    /**
     * Test a specific API endpoint
     * @param {string} endpoint - The endpoint to test
     * @returns {Promise<object>} - The response data
     */
    async testEndpoint(endpoint) {
        try {
            console.log(`Testing endpoint: ${endpoint}`);
            const response = await api.get(endpoint);
            console.log(`Success for ${endpoint}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Failed for ${endpoint}:`, error);
            return { error: error.message };
        }
    }

    /**
     * Test all predefined endpoints
     * @returns {Promise<object>} - Results for all endpoints
     */
    async testAllEndpoints() {
        const results = {
            myEvents: {},
            attendingEvents: {}
        };

        // Test my events endpoints
        console.group('Testing My Events Endpoints');
        for (const endpoint of this.endpoints.myEvents) {
            results.myEvents[endpoint] = await this.testEndpoint(endpoint);
        }
        console.groupEnd();

        // Test attending events endpoints
        console.group('Testing Attending Events Endpoints');
        for (const endpoint of this.endpoints.attendingEvents) {
            results.attendingEvents[endpoint] = await this.testEndpoint(endpoint);
        }
        console.groupEnd();

        return results;
    }

    /**
     * Get authentication status
     * @returns {object} - Auth status
     */
    getAuthStatus() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        return {
            hasToken: !!token,
            tokenExpired: token ? this.isTokenExpired(token) : null,
            hasUser: !!user,
            userData: user ? JSON.parse(user) : null
        };
    }

    /**
     * Check if token is expired
     * @param {string} token - JWT token
     * @returns {boolean} - True if expired
     */
    isTokenExpired(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const { exp } = JSON.parse(jsonPayload);
            return exp * 1000 < Date.now();
        } catch (e) {
            console.error('Failed to decode token:', e);
            return true; // Assume expired if can't decode
        }
    }
}

// Initialize and expose to window for browser console access
const initApiDebugger = () => {
    window.debugAPI = new ApiDebugger();
    console.log('API Debugger initialized. Use window.debugAPI.testAllEndpoints() to test API endpoints');
};

export default initApiDebugger;