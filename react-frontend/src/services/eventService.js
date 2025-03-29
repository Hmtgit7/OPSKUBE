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
        // Try multiple possible endpoints in sequence until one works
        const endpoints = [
            '/events/my-events',
            '/my-events',
            '/events?owner=me',
            '/events/user/me'
        ];

        let lastError = null;

        // Try each endpoint in sequence
        for (const endpoint of endpoints) {
            try {
                console.log(`Attempting to fetch my events from: ${endpoint}`);
                const response = await api.get(endpoint);
                console.log(`Success with endpoint ${endpoint}:`, response.data);
                return response.data;
            } catch (error) {
                console.warn(`Endpoint ${endpoint} failed:`, error);
                lastError = error;
                // Continue to next endpoint
            }
        }

        // If we get here, all endpoints failed
        throw lastError || new Error('Failed to fetch created events');
    } catch (error) {
        console.error('Get my events error:', error);
        throw error;
    }
};

// Get events the user is attending
export const getAttendingEvents = async () => {
    try {
        // Use fallback mechanism
        let response;
        let error;

        // Try primary endpoint
        try {
            response = await api.get('/events/attending');
            return response.data;
        } catch (e) {
            error = e;
            console.log('Primary endpoint failed, trying fallback:', e);

            // Try alternative approach - create a custom attending endpoint
            try {
                // Get all user RSVPs with 'attending' status
                const rsvpsResponse = await api.get('/events');
                const allEvents = rsvpsResponse.data.events;

                // Since the backend isn't filtering properly, we'll do it client-side
                // by fetching events the user has explicitly marked as attending

                // For each event, check if the user has RSVPed
                const attendingEvents = [];
                for (const event of allEvents) {
                    try {
                        const rsvpResponse = await api.get(`/events/${event.id}/rsvp/me`);
                        if (rsvpResponse.data.rsvpStatus === 'attending') {
                            attendingEvents.push(event);
                        }
                    } catch (rsvpError) {
                        // Skip if no RSVP found
                        continue;
                    }
                }

                return attendingEvents;
            } catch (fallbackError) {
                console.error('All fallback attempts failed:', fallbackError);
                throw error; // Throw the original error
            }
        }
    } catch (error) {
        console.error('Get attending events error:', error);
        throw error;
    }
};
