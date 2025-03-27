import { useState, useEffect, useCallback } from 'react';
import { Event } from '../types';
import * as EventService from '../services/eventService';

type EventHookReturn = {
    event: Event | null;
    isLoading: boolean;
    error: string | null;
    fetchEvent: (id: number) => Promise<void>;
};

export const useEvent = (initialId?: number): EventHookReturn => {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvent = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await EventService.getEventById(id);
            setEvent(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch event');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialId) {
            fetchEvent(initialId);
        }
    }, [fetchEvent, initialId]);

    return { event, isLoading, error, fetchEvent };
};