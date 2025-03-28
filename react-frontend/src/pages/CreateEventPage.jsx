import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { createEvent } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import EventForm from '../components/events/EventForm';
import { formatDateForInput } from '../utils/dateUtils';
import { toast } from 'react-toastify';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user } } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set initial values for form
    const initialValues = {
        name: '',
        description: '',
        date: formatDateForInput(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)), // Tomorrow
        location: ''
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Please log in to create an event');
            navigate('/login', { state: { from: '/events/new' } });
        }
    }, [isAuthenticated, navigate]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            // Create event
            const event = await createEvent(values);

            // Show success message
            toast.success('Event created successfully!');

            // Navigate to the event details page
            navigate(`/events/${event.id}`);
        } catch (error) {
            toast.error(error.message || 'Failed to create event');
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container-custom py-12">
                <Link to="/events" className="flex items-center text-primary-600 dark:text-primary-400 mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Events
                </Link>

                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Fill out the form below to create your event. All fields are required.
                    </p>

                    <EventForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default CreateEventPage;