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

const MyEventsPage = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user } } = useAuth();

    const [createdEvents, setCreatedEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [createdLoading, setCreatedLoading] = useState(true);
    const [attendingLoading, setAttendingLoading] = useState(true);
    const [createdError, setCreatedError] = useState(null);
    const [attendingError, setAttendingError] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Please log in to view your events');
            navigate('/login', { state: { from: '/my-events' } });
        }
    }, [isAuthenticated, navigate]);

    // Fetch created events
    useEffect(() => {
        const fetchCreatedEvents = async () => {
            setCreatedLoading(true);
            setCreatedError(null);

            try {
                const data = await getMyEvents();
                console.log('My events data:', data);

                // Handle different response formats
                let eventsArray = data;
                if (Array.isArray(data.events)) {
                    eventsArray = data.events;
                } else if (data.content && Array.isArray(data.content)) {
                    eventsArray = data.content;
                }

                setCreatedEvents(Array.isArray(eventsArray) ? eventsArray : []);
            } catch (err) {
                console.error('Failed to load created events:', err);
                setCreatedError('Failed to load your created events. Please try again.');
                toast.error('Failed to load your created events');
            } finally {
                setCreatedLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCreatedEvents();
        }
    }, [isAuthenticated]);

    // Fetch attending events
    useEffect(() => {
        const fetchAttendingEvents = async () => {
            setAttendingLoading(true);
            setAttendingError(null);

            try {
                const data = await getAttendingEvents();
                console.log('Attending events data:', data);

                // Handle different response formats
                let eventsArray = data;
                if (Array.isArray(data.events)) {
                    eventsArray = data.events;
                } else if (data.content && Array.isArray(data.content)) {
                    eventsArray = data.content;
                }

                setAttendingEvents(Array.isArray(eventsArray) ? eventsArray : []);
            } catch (err) {
                console.error('Failed to load attending events:', err);
                setAttendingError('Failed to load events you\'re attending. Please try again.');
                toast.error('Failed to load events you\'re attending');
            } finally {
                setAttendingLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchAttendingEvents();
        }
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
                            </Tab.Panel>
                            <Tab.Panel>
                                <EventList
                                    events={attendingEvents}
                                    isLoading={attendingLoading}
                                    error={attendingError}
                                    emptyMessage="You're not attending any events yet. Browse events to find some you'd like to attend!"
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </Layout>
    );
};

export default MyEventsPage;