import { useState, useEffect, useCallback } from 'react';
import { RsvpStatus } from '../types';
import * as RsvpService from '../services/rsvpService';
import { useAuth } from '../context/AuthContext';

type RsvpHookReturn = {
    rsvpStatus: RsvpStatus;
    isLoading: boolean;
    error: string | null;
    submitRsvp: (status: RsvpStatus) => Promise<void>;
    cancelRsvp: () => Promise<void>;
};

export const useRsvp = (eventId: number): RsvpHookReturn => {
    const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { state: { isAuthenticated } } = useAuth();

    const fetchRsvpStatus = useCallback(async () => {
        if (!isAuthenticated || !eventId) return;

        setIsLoading(true);
        setError(null);

        try {
            const status = await RsvpService.getUserRsvp(eventId);
            setRsvpStatus(status);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch RSVP status');
        } finally {
            setIsLoading(false);
        }
    }, [eventId, isAuthenticated]);

    useEffect(() => {
        fetchRsvpStatus();
    }, [fetchRsvpStatus]);

    const submitRsvp = async (status: RsvpStatus) => {
        if (!status || !eventId) return;

        setIsLoading(true);
        setError(null);

        try {
            await RsvpService.createRsvp(eventId, status);
            setRsvpStatus(status);
        } catch (err: any) {
            setError(err.message || 'Failed to submit RSVP');
        } finally {
            setIsLoading(false);
        }
    };

    const cancelRsvp = async () => {
        if (!eventId) return;

        setIsLoading(true);
        setError(null);

        try {
            await RsvpService.deleteRsvp(eventId);
            setRsvpStatus(null);
        } catch (err: any) {
            setError(err.message || 'Failed to cancel RSVP');
        } finally {
            setIsLoading(false);
        }
    };

    return { rsvpStatus, isLoading, error, submitRsvp, cancelRsvp };
};