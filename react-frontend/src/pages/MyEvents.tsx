import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Alert,
    Tabs,
    Tab,
    CircularProgress,
    Grid
} from '@mui/material';
import Add from "@mui/icons-material/Add";;
import Layout from '../components/Layout/Layout';
import EventCard from '../components/Events/EventCard';
import { Event } from '../types';
import * as EventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const MyEvents: React.FC = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user } } = useAuth();

    const [activeTab, setActiveTab] = useState<'created' | 'attending'>('created');
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
    const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch user's events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) return;

            setIsLoading(true);
            setError(null);

            try {
                // This is a simplified approach. In a real application, you would create
                // specific API endpoints for user-created events and RSVP'ed events.
                const response = await EventService.getEvents({
                    page: 1,
                    limit: 100
                });

                // Filter events created by user
                const created = response.events.filter(event => event.userId === user.id);
                setCreatedEvents(created);

                // For demo purposes, we'll show all events as attending events
                // In a real app, you would fetch RSVP'ed events from a dedicated endpoint
                const attending = response.events.filter(event => event.userId !== user.id);
                setAttendingEvents(attending);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch events');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: 'created' | 'attending') => {
        setActiveTab(newValue);
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Typography
                        variant="h4"
                        component="h1"
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
                    >
                        My Events
                    </Typography>

                    <Button
                        component={Link}
                        to="/events/new"
                        variant="contained"
                        startIcon={<Add />}
                        className="bg-primary-main hover:bg-primary-dark text-white self-start sm:self-auto"
                    >
                        Create Event
                    </Button>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="mb-6"
                >
                    <Tab
                        label="Events I Created"
                        value="created"
                        className={activeTab === 'created' ? 'text-primary-main' : 'text-gray-600 dark:text-gray-300'}
                    />
                    <Tab
                        label="Events I'm Attending"
                        value="attending"
                        className={activeTab === 'attending' ? 'text-primary-main' : 'text-gray-600 dark:text-gray-300'}
                    />
                </Tabs>

                {isLoading ? (
                    <Box className="flex items-center justify-center py-16">
                        <CircularProgress size={40} className="text-primary-main" />
                    </Box>
                ) : error ? (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                ) : (
                    <>
                        {activeTab === 'created' && (
                            createdEvents.length === 0 ? (
                                <Box className="text-center py-16">
                                    <Typography variant="h6" className="text-gray-600 dark:text-gray-300 mb-4">
                                        You haven't created any events yet
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to="/events/new"
                                        variant="contained"
                                        className="bg-primary-main hover:bg-primary-dark text-white"
                                    >
                                        Create Your First Event
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={4}>
                                    {createdEvents.map((event) => (
                                        <Grid component="div" item key={event.id} xs={12} sm={6} md={4} className="h-full">
                                            <EventCard event={event} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )
                        )}

                        {activeTab === 'attending' && (
                            attendingEvents.length === 0 ? (
                                <Box className="text-center py-16">
                                    <Typography variant="h6" className="text-gray-600 dark:text-gray-300 mb-4">
                                        You haven't RSVP'd to any events yet
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to="/events"
                                        variant="contained"
                                        className="bg-primary-main hover:bg-primary-dark text-white"
                                    >
                                        Browse Events
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={4}>
                                    {attendingEvents.map((event) => (
                                        <Grid component="div" item key={event.id} xs={12} sm={6} md={4} className="h-full">
                                            <EventCard event={event} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )
                        )}
                    </>
                )}
            </Container>
        </Layout>
    );
};

export default MyEvents;