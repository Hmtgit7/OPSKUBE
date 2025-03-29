// src/pages/MyEventsPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { getMyEvents, getAttendingEvents } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';

const MyEventsPage = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user } } = useAuth();

    const [createdEvents, setCreatedEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [createdLoading, setCreatedLoading] = useState(true);
    const [attendingLoading, setAttendingLoading] = useState(true);
    const [createdError, setCreatedError] = useState(null);
    const [attendingError, setAttendingError] = useState(null);

    const filterAttendingEvents = async (events) => {
        if (!events || events.length === 0) return [];

        // For each event, get user's RSVP status
        const attendingEvents = [];
        for (const event of events) {
            try {
                // Try to get RSVP status
                const rsvpResponse = await api.get(`/events/${event.id}/rsvp/me`);
                if (rsvpResponse.data.rsvpStatus === 'attending') {
                    attendingEvents.push(event);
                }
            } catch (error) {
                // Skip events with no RSVP
                console.log(`No RSVP for event ${event.id}`);
            }
        }

        return attendingEvents;
    };


    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Please log in to view your events');
            navigate('/login', { state: { from: '/my-events' } });
        }
    }, [isAuthenticated, navigate]);

    // Normalize events data based on different possible response formats
    const normalizeEventsData = (data) => {
        // Helper function to check if something is an event object
        const isEventObject = (obj) => {
            return obj && typeof obj === 'object' &&
                (obj.name !== undefined || obj.title !== undefined) &&
                (obj.date !== undefined || obj.eventDate !== undefined);
        };

        console.log('Normalizing data:', data);

        // If data is null or undefined, return empty array
        if (!data) return [];

        // If data is already an array, check if it contains events
        if (Array.isArray(data)) {
            // If first item looks like an event, return the array
            if (data.length > 0 && isEventObject(data[0])) {
                return data;
            }
        }

        // Check common response formats
        if (data.events && Array.isArray(data.events)) {
            return data.events;
        }

        if (data.content && Array.isArray(data.content)) {
            return data.content;
        }

        if (data.data && Array.isArray(data.data)) {
            return data.data;
        }

        if (data.items && Array.isArray(data.items)) {
            return data.items;
        }

        // If we can't determine the format, return empty array
        console.warn('Could not normalize events data:', data);
        return [];
    };

    // Fetch created events
    useEffect(() => {
        const fetchCreatedEvents = async () => {
            if (!isAuthenticated) return;

            setCreatedLoading(true);
            setCreatedError(null);

            try {
                const data = await getMyEvents();
                console.log('My events raw data:', data);

                const normalizedEvents = normalizeEventsData(data);
                console.log('Normalized created events:', normalizedEvents);

                setCreatedEvents(normalizedEvents);
            } catch (err) {
                console.error('Failed to load created events:', err);
                setCreatedError('Failed to load your created events. Please try again.');
                toast.error('Failed to load your created events');
            } finally {
                setCreatedLoading(false);
            }
        };

        fetchCreatedEvents();
    }, [isAuthenticated]);

    // Fetch attending events
    useEffect(() => {
        const fetchAttendingEvents = async () => {
            if (!isAuthenticated) return;

            setAttendingLoading(true);
            setAttendingError(null);

            try {
                // First try to get events from the attending endpoint
                let data = await getAttendingEvents();
                console.log('Attending events raw data:', data);

                // Check if we got a proper response or if we need to filter manually
                if (data && data.events && Array.isArray(data.events)) {
                    // We got all events instead of just attending ones, need to filter
                    console.log('Got all events, filtering client-side...');

                    const eventsToFilter = data.events;
                    const attendingEventsList = [];

                    // Get user's RSVPs for each event
                    for (const event of eventsToFilter) {
                        try {
                            const rsvpResponse = await api.get(`/events/${event.id}/rsvp/me`);
                            if (rsvpResponse.data &&
                                rsvpResponse.data.rsvpStatus === 'attending') {
                                attendingEventsList.push(event);
                            }
                        } catch (rsvpError) {
                            // No RSVP for this event, skip it
                            console.log(`No RSVP for event ${event.id}`, rsvpError);
                        }
                    }

                    console.log(`Filtered ${eventsToFilter.length} events down to ${attendingEventsList.length} attending events`);
                    setAttendingEvents(attendingEventsList);
                } else {
                    // We got a proper response from the attending endpoint
                    const normalizedEvents = normalizeEventsData(data);
                    console.log('Normalized attending events:', normalizedEvents);
                    setAttendingEvents(normalizedEvents);
                }
            } catch (err) {
                console.error('Failed to load attending events:', err);
                setAttendingError('Failed to load events you\'re attending. Please try again.');
                toast.error('Failed to load events you\'re attending');

                // Fallback: try to get all events and check RSVPs
                try {
                    console.log('Trying fallback method for attending events...');
                    const eventsResponse = await api.get('/events');
                    if (eventsResponse.data && eventsResponse.data.events) {
                        const allEvents = eventsResponse.data.events;
                        const attendingEventsList = [];

                        // Check each event for RSVP status
                        for (const event of allEvents) {
                            try {
                                const rsvpResponse = await api.get(`/events/${event.id}/rsvp/me`);
                                if (rsvpResponse.data &&
                                    rsvpResponse.data.rsvpStatus === 'attending') {
                                    attendingEventsList.push(event);
                                }
                            } catch (rsvpError) {
                                // Skip events with no RSVP
                            }
                        }

                        console.log(`Fallback found ${attendingEventsList.length} attending events`);
                        setAttendingEvents(attendingEventsList);
                        setAttendingError(null); // Clear error if fallback worked
                    }
                } catch (fallbackErr) {
                    console.error('Fallback method also failed:', fallbackErr);
                }
            } finally {
                setAttendingLoading(false);
            }
        };

        fetchAttendingEvents();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="container-custom py-12">
                    <LoadingSpinner text="Redirecting to login..." />
                </div>
            </Layout>
        );
    }

    // Retry loading handler
    const handleRetryCreated = async () => {
        toast.info('Retrying to load your created events...');
        setCreatedLoading(true);
        setCreatedError(null);

        try {
            const data = await getMyEvents();
            const normalizedEvents = normalizeEventsData(data);
            setCreatedEvents(normalizedEvents);
            toast.success('Events loaded successfully!');
        } catch (err) {
            setCreatedError('Failed to load your created events. Please try again.');
            toast.error('Failed to load your created events');
        } finally {
            setCreatedLoading(false);
        }
    };

    const handleRetryAttending = async () => {
        toast.info('Retrying to load events you\'re attending...');
        setAttendingLoading(true);
        setAttendingError(null);

        try {
            const data = await getAttendingEvents();
            const normalizedEvents = normalizeEventsData(data);
            setAttendingEvents(normalizedEvents);
            toast.success('Events loaded successfully!');
        } catch (err) {
            setAttendingError('Failed to load events you\'re attending. Please try again.');
            toast.error('Failed to load events you\'re attending');
        } finally {
            setAttendingLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-custom py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Events</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your events and RSVPs
                        </p>
                    </div>

                    <Link
                        to="/events/new"
                        className="btn-primary mt-4 md:mt-0 flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Create Event
                    </Link>
                </div>

                <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden">
                    <Tab.Group>
                        <Tab.List className="flex border-b border-gray-200 dark:border-dark-600">
                            <Tab
                                className={({ selected }) =>
                                    `flex-1 py-4 px-4 text-center focus:outline-none ${selected
                                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-medium'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`
                                }
                            >
                                Events I Created
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `flex-1 py-4 px-4 text-center focus:outline-none ${selected
                                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-medium'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`
                                }
                            >
                                Events I'm Attending
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="p-6">
                            <Tab.Panel>
                                <EventList
                                    events={createdEvents}
                                    isLoading={createdLoading}
                                    error={createdError}
                                    emptyMessage="You haven't created any events yet. Click 'Create Event' to get started!"
                                />
                                {createdError && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={handleRetryCreated}
                                            className="btn-primary"
                                        >
                                            Retry Loading Events
                                        </button>
                                    </div>
                                )}
                            </Tab.Panel>
                            <Tab.Panel>
                                <EventList
                                    events={attendingEvents}
                                    isLoading={attendingLoading}
                                    error={attendingError}
                                    emptyMessage="You're not attending any events yet. Browse events to find some you'd like to attend!"
                                />
                                {attendingError && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={handleRetryAttending}
                                            className="btn-primary"
                                        >
                                            Retry Loading Events
                                        </button>
                                    </div>
                                )}
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </Layout>
    );
};

export default MyEventsPage;