import api from './api';
import {
    Event,
    EventFormData,
    EventFilter,
    EventsResponse
} from '../types';

// Get all events with pagination and filters
export const getEvents = async (filter: EventFilter): Promise<EventsResponse> => {
    const { name, date, page, limit } = filter;
    let url = `/events?page=${page}&limit=${limit}`;

    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (date) url += `&date=${encodeURIComponent(date)}`;

    const response = await api.get<EventsResponse>(url);
    return response.data;
};

// Get a single event by ID
export const getEventById = async (id: number): Promise<Event> => {
    const response = await api.get<{ event: Event }>(`/events/${id}`);
    return response.data.event;
};

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event> => {
    const response = await api.post<{ event: Event, message: string }>('/events', eventData);
    return response.data.event;
};

// Update an existing event
export const updateEvent = async (id: number, eventData: EventFormData): Promise<Event> => {
    const response = await api.put<{ event: Event, message: string }>(`/events/${id}`, eventData);
    return response.data.event;
};

// Delete an event
export const deleteEvent = async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
};