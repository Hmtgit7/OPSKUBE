import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import EventForm from '../components/Events/EventForm';
import { EventFormData } from '../types';
import * as EventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../hooks/useEvent';

const EditEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = parseInt(id || '0');
    const navigate = useNavigate();

    const { state: { user, isAuthenticated } } = useAuth();
    const { event, isLoading, error: fetchError, fetchEvent } = useEvent(eventId);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState<EventFormData | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Set initial form values when event is loaded
    useEffect(() => {
        if (event) {
            // Format date for datetime-local input
            const date = new Date(event.date);
            const formattedDate = date.toISOString().slice(0, 16); // format: YYYY-MM-DDThh:mm

            setInitialValues({
                name: event.name,
                description: event.description,
                date: formattedDate,
                location: event.location,
            });

            // Check if current user is the event organizer
            if (user && event.userId !== user.id) {
                setError('You do not have permission to edit this event');
            }
        }
    }, [event, user]);

    // Handle form submission
    const handleSubmit = async (values: EventFormData) => {
        if (!event) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const updatedEvent = await EventService.updateEvent(event.id, values);
            navigate(`/events/${updatedEvent.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update event');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Box className="flex items-center justify-center py-16">
                        <CircularProgress size={40} className="text-primary-main" />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (fetchError || !event) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Alert severity="error" className="mb-4">
                        {fetchError || 'Event not found'}
                    </Alert>
                    <Button
                        component={Link}
                        to="/events"
                        startIcon={<ArrowBack />}
                        className="text-primary-main"
                    >
                        Back to Events
                    </Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <Box className="mb-6">
                    <Button
                        component={Link}
                        to={`/events/${event.id}`}
                        startIcon={<ArrowBack />}
                        className="text-primary-main mb-4"
                    >
                        Back to Event
                    </Button>

                    <Typography
                        variant="h4"
                        component="h1"
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Edit Event
                    </Typography>

                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {initialValues && (
                        <EventForm
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            event={event}
                            isEdit={true}
                        />
                    )}
                </Box>
            </Container>
        </Layout>
    );
};

export default EditEvent;