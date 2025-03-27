import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import EventForm from '../components/Events/EventForm';
import { EventFormData } from '../types';
import * as EventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated } } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form with current date and time
    const initialValues: EventFormData = {
        name: '',
        description: '',
        date: new Date().toISOString().slice(0, 16), // format: YYYY-MM-DDThh:mm
        location: '',
    };

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Handle form submission
    const handleSubmit = async (values: EventFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const event = await EventService.createEvent(values);
            navigate(`/events/${event.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to create event');
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Box className="mb-6">
                    <Button
                        component={Link}
                        to="/events"
                        startIcon={<ArrowBack />}
                        className="text-primary-main mb-4"
                    >
                        Back to Events
                    </Button>

                    <Typography
                        variant="h4"
                        component="h1"
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Create New Event
                    </Typography>

                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <EventForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </Box>
            </Container>
        </Layout>
    );
};

export default CreateEvent;