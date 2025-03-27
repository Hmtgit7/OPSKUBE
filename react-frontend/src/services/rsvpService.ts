import api from './api';
import { Rsvp, RsvpStatus } from '../types';

// Create or update RSVP for an event
export const createRsvp = async (eventId: number, status: RsvpStatus): Promise<Rsvp> => {
    const response = await api.post<{ rsvp: Rsvp, message: string }>(`/events/${eventId}/rsvp`, { status });
    return response.data.rsvp;
};

// Get all RSVPs for an event (organizer only)
export const getEventRsvps = async (eventId: number): Promise<Rsvp[]> => {
    const response = await api.get<{ rsvps: Rsvp[] }>(`/events/${eventId}/rsvp`);
    return response.data.rsvps;
};

// Get current user's RSVP status for an event
export const getUserRsvp = async (eventId: number): Promise<RsvpStatus> => {
    const response = await api.get<{ rsvpStatus: RsvpStatus }>(`/events/${eventId}/rsvp/me`);
    return response.data.rsvpStatus;
};

// Delete RSVP
export const deleteRsvp = async (eventId: number): Promise<void> => {
    await api.delete(`/events/${eventId}/rsvp`);
};