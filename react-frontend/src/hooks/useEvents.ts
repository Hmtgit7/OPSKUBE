import { useState, useEffect, useCallback } from 'react';
import { Event, EventFilter, EventsResponse } from '../types';
import * as EventService from '../services/eventService';

type EventsHookReturn = {
    events: Event[];
    pagination: EventsResponse['pagination'] | null;
    isLoading: boolean;
    error: string | null;
    fetchEvents: (filter: EventFilter) => Promise<void>;
};

export const useEvents = (initialFilter: EventFilter): EventsHookReturn => {
    const [events, setEvents] = useState<Event[]>([]);
    const [pagination, setPagination] = useState<EventsResponse['pagination'] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<EventFilter>(initialFilter);

    const fetchEvents = useCallback(async (newFilter: EventFilter) => {
        setFilter(newFilter);
        setIsLoading(true);
        setError(null);

        try {
            const response = await EventService.getEvents(newFilter);
            setEvents(response.events);
            setPagination(response.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents(filter);
    }, [fetchEvents, filter]);

    return { events, pagination, isLoading, error, fetchEvents };
};