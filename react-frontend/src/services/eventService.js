// src/services/eventService.js
import api, { getBackendType } from './api';

// Get all events with pagination and filters
export const getEvents = async (filters = {}) => {
    try {
        const { name, date, page = 1, limit = 9 } = filters;

        // Base URL with pagination
        let url = `/events?page=${page}&limit=${limit}`;

        // Adjust page number for Java backend (starts from 0)
        if (getBackendType() === 'java') {
            url = `/events?page=${page - 1}&limit=${limit}`;
        }

        // Add filters if provided
        if (name) url += `&name=${encodeURIComponent(name)}`;
        if (date) url += `&date=${encodeURIComponent(date)}`;

        const response = await api.get(url);

        // Check if response contains expected data structure
        if (!response.data) {
            console.error('Unexpected event response format:', response);
            throw new Error('Unexpected response format from server');
        }

        return response.data;
    } catch (error) {
        console.error('Get events error:', error);
        throw error;
    }
};

// Get a single event by ID
export const getEventById = async (id) => {
    try {
        const response = await api.get(`/events/${id}`);

        // Handle different response formats between backends
        return getBackendType() === 'node' ? response.data.event : response.data;
    } catch (error) {
        console.error(`Get event ${id} error:`, error);
        throw error;
    }
};

// Create a new event
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);

        // Handle different response formats between backends
        return getBackendType() === 'node' ? response.data.event : response.data;
    } catch (error) {
        console.error('Create event error:', error);
        throw error;
    }
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
    try {
        const response = await api.put(`/events/${id}`, eventData);

        // Handle different response formats between backends
        return getBackendType() === 'node' ? response.data.event : response.data;
    } catch (error) {
        console.error(`Update event ${id} error:`, error);
        throw error;
    }
};

// Delete an event
export const deleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Delete event ${id} error:`, error);
        throw error;
    }
};

// Get current user's events
export const getMyEvents = async () => {
    try {
        const backendType = getBackendType();

        // Different endpoints for different backends
        const endpoint = backendType === 'node' ? '/events/my-events' : '/events/my-events';

        // Attempt to use the endpoint
        try {
            const response = await api.get(endpoint);
            return response.data;
        } catch (firstError) {
            // If the first endpoint fails, try an alternative endpoint
            console.warn(`First endpoint failed: ${endpoint}, trying alternative...`);
            const altEndpoint = '/my-events';
            const response = await api.get(altEndpoint);
            return response.data;
        }
    } catch (error) {
        console.error('Get my events error:', error);
        throw error;
    }
};

// Get events the user is attending
export const getAttendingEvents = async () => {
    try {
        const backendType = getBackendType();

        // Different endpoints for different backends
        const endpoint = backendType === 'node' ? '/events/attending' : '/events/attending';
        const response = await api.get(endpoint);

        return response.data;
    } catch (error) {
        console.error('Get attending events error:', error);
        throw error;
    }
};