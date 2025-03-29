// src/services/rsvpService.js
import api, { getBackendType } from './api';
import rsvpCache from './rsvpCache';

// Create or update RSVP for an event
export const createRsvp = async (eventId, status) => {
    try {
        const response = await api.post(`/events/${eventId}/rsvp`, { status });

        // Update cache
        rsvpCache.setStatus(eventId, status);

        return response.data;
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
        console.error(`Get RSVPs for event ${eventId} error:`, error);
        throw error;
    }
};

// Get current user's RSVP status for an event
export const getUserRsvpStatus = async (eventId) => {
    try {
        // Check cache first
        const cachedStatus = rsvpCache.getStatus(eventId);
        if (cachedStatus) {
            return { rsvpStatus: cachedStatus };
        }

        // If not in cache, fetch from API
        const response = await api.get(`/events/${eventId}/rsvp/me`);

        // Update cache
        if (response.data.rsvpStatus) {
            rsvpCache.setStatus(eventId, response.data.rsvpStatus);
        }

        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return { rsvpStatus: null };
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
        console.error(`Delete RSVP for event ${eventId} error:`, error);
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