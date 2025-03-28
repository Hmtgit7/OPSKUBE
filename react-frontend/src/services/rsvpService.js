import api, { getBackendType } from './api';

// Create or update RSVP for an event
export const createRsvp = async (eventId, status) => {
    try {
        // Handle status format differently for Java backend
        let rsvpData = { status };

        if (getBackendType() === 'java') {
            // Java backend expects status in uppercase
            rsvpData.status = status.toUpperCase();
        }

        const response = await api.post(`/events/${eventId}/rsvp`, rsvpData);

        // Return standardized response
        return {
            message: response.data.message,
            rsvp: response.data.rsvp
        };
    } catch (error) {
        throw error;
    }
};

// Get all RSVPs for an event (organizer only)
export const getEventRsvps = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}/rsvp`);

        // Handle different response formats between backends
        return getBackendType() === 'node' ? response.data.rsvps : response.data.rsvps;
    } catch (error) {
        throw error;
    }
};

// Get current user's RSVP status for an event
export const getUserRsvpStatus = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}/rsvp/me`);

        // Process response based on backend type
        if (getBackendType() === 'node') {
            return response.data.rsvpStatus;
        } else {
            // Java backend returns object with rsvpStatus property
            return response.data.rsvpStatus;
        }
    } catch (error) {
        // If error is 404, it means no RSVP found, which is ok
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

// Delete RSVP
export const deleteRsvp = async (eventId) => {
    try {
        const response = await api.delete(`/events/${eventId}/rsvp`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Normalize RSVP status format
export const normalizeRsvpStatus = (status) => {
    if (!status) return null;

    // Java backend uses uppercase, normalize to lowercase for UI
    if (typeof status === 'string') {
        return status.toLowerCase();
    }

    return status;
};