import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { getEventById, updateEvent } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import EventForm from '../components/events/EventForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDateForInput } from '../utils/dateUtils';
import { toast } from 'react-toastify';

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state: { isAuthenticated, user } } = useAuth();

    const [event, setEvent] = useState(null);
    const [initialValues, setInitialValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Please log in to edit an event');
            navigate('/login', { state: { from: `/events/${id}/edit` } });
        }
    }, [isAuthenticated, navigate, id]);

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);

            try {
                const data = await getEventById(parseInt(id));
                setEvent(data);

                // Format date for form input
                setInitialValues({
                    name: data.name,
                    description: data.description,
                    date: formatDateForInput(new Date(data.date)),
                    location: data.location
                });

                setError(null);
            } catch (err) {
                setError('Failed to load event details');
                toast.error('Failed to load event details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchEvent();
        }
    }, [id, isAuthenticated]);

    // Check if user is the event organizer
    useEffect(() => {
        if (event && user) {
            const isOrganizer = event.organizer?.id === user.id || event.userId === user.id;

            if (!isOrganizer) {
                toast.error('You do not have permission to edit this event');
                navigate(`/events/${id}`);
            }
        }
    }, [event, user, navigate, id]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            // Update event
            await updateEvent(parseInt(id), values);

            // Show success message
            toast.success('Event updated successfully!');

            // Navigate to the event details page
            navigate(`/events/${id}`);
        } catch (error) {
            toast.error(error.message || 'Failed to update event');
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container-custom py-12">
                <Link to={`/events/${id}`} className="flex items-center text-primary-600 dark:text-primary-400 mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Event
                </Link>

                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner text="Loading event details..." />
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-lg">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Update your event details below. All fields are required.
                            </p>

                            {initialValues && (
                                <EventForm
                                    initialValues={initialValues}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    event={event}
                                    isEdit={true}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default EditEventPage;