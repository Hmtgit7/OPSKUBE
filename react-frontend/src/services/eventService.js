import api, { getBackendType } from './api';

// Get all events with pagination and filters
export const getEvents = async (filters = {}) => {
    try {
        const { name, date, page = 1, limit = 9 } = filters;
        let url = `/events?page=${page}&limit=${limit}`;

        // Adjust page number for Java backend (starts from 0)
        if (getBackendType() === 'java') {
            url = `/events?page=${page - 1}&limit=${limit}`;
        }

        if (name) url += `&name=${encodeURIComponent(name)}`;
        if (date) url += `&date=${encodeURIComponent(date)}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
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
        throw error;
    }
};

// Delete an event
export const deleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get current user's events
export const getMyEvents = async () => {
    try {
        const response = await api.get('/events/my-events');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get events the user is attending
export const getAttendingEvents = async () => {
    try {
        const backendType = getBackendType();

        // Different endpoints for different backends
        const endpoint = backendType === 'node' ? '/my-events' : '/events/attending';
        const response = await api.get(endpoint);

        return response.data;
    } catch (error) {
        throw error;
    }
};