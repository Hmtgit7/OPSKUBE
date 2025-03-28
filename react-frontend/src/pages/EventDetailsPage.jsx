import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    ClockIcon,
    LocationMarkerIcon,
    UserIcon,
    CalendarIcon,
    PencilAltIcon,
    TrashIcon
} from '@heroicons/react/outline';
import { ExclamationIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { formatDate, formatRelativeTime, isDatePast } from '../utils/dateUtils';
import { getEventById, deleteEvent } from '../services/eventService';
import { createRsvp, getUserRsvpStatus, deleteRsvp } from '../services/rsvpService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import RsvpComponent from '../components/events/RsvpComponent';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const EventDetailsPage = () => {
    const { id } = useParams();
    const { state: { user } } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rsvpStatus, setRsvpStatus] = useState(null);
    const [rsvpLoading, setRsvpLoading] = useState(true);
    const [rsvpError, setRsvpError] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check if current user is the event organizer
    const isOrganizer = event && user ? event.organizer?.id === user.id || event.userId === user.id : false;

    // Check if event is in the past
    const isPastEvent = event ? isDatePast(event.date) : false;

    // Fetch event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            setIsLoading(true);
            try {
                const data = await getEventById(parseInt(id));
                setEvent(data);
                setError(null);
            } catch (err) {
                setError('Failed to load event details');
                toast.error('Failed to load event details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    // Fetch RSVP status if user is authenticated and not the organizer
    useEffect(() => {
        if (event && user && !isOrganizer) {
            const fetchRsvpStatus = async () => {
                setRsvpLoading(true);
                try {
                    const status = await getUserRsvpStatus(parseInt(id));
                    setRsvpStatus(status);
                    setRsvpError(null);
                } catch (err) {
                    setRsvpError('Failed to load your RSVP status');
                    console.error(err);
                } finally {
                    setRsvpLoading(false);
                }
            };

            fetchRsvpStatus();
        } else {
            setRsvpLoading(false);
        }
    }, [id, event, user, isOrganizer]);

    // Handle RSVP creation/update
    const handleRsvp = async (status) => {
        try {
            await createRsvp(parseInt(id), status);
            setRsvpStatus(status);
            toast.success('RSVP updated successfully');
            return true;
        } catch (err) {
            setRsvpError('Failed to update RSVP');
            toast.error('Failed to update RSVP');
            console.error(err);
            return false;
        }
    };

    // Handle RSVP deletion
    const handleCancelRsvp = async () => {
        try {
            await deleteRsvp(parseInt(id));
            setRsvpStatus(null);
            toast.success('RSVP cancelled successfully');
            return true;
        } catch (err) {
            setRsvpError('Failed to cancel RSVP');
            toast.error('Failed to cancel RSVP');
            console.error(err);
            return false;
        }
    };

    // Handle event deletion
    const handleDeleteEvent = async () => {
        setIsDeleting(true);
        try {
            await deleteEvent(parseInt(id));
            toast.success('Event deleted successfully');
            navigate('/my-events');
        } catch (err) {
            toast.error('Failed to delete event');
            console.error(err);
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Layout>
                <div className="container-custom py-12">
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner text="Loading event details..." />
                    </div>
                </div>
            </Layout>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <Layout>
                <div className="container-custom py-12">
                    <Link to="/events" className="flex items-center text-primary-600 dark:text-primary-400 mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Events
                    </Link>

                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error || 'Event not found'}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-custom py-12">
                <Link to="/events" className="flex items-center text-primary-600 dark:text-primary-400 mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Banner and header */}
                            <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 rounded-t-xl p-8 text-white">
                                {/* Date badge */}
                                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                                    {formatRelativeTime(event.date)}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-6">{event.name}</h1>

                                {/* Event status badge */}
                                <div className="mb-6">
                                    {isPastEvent ? (
                                        <span className="badge badge-neutral">Past Event</span>
                                    ) : (
                                        <span className="badge badge-success">Upcoming Event</span>
                                    )}
                                </div>

                                {/* Event details */}
                                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                                    <div className="flex items-center">
                                        <CalendarIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span>{formatDate(event.date, 'EEEE, MMMM dd, yyyy')}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <ClockIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span>{formatDate(event.date, 'h:mm a')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event content */}
                            <div className="bg-white dark:bg-dark-700 rounded-b-xl shadow-md p-6 md:p-8">
                                {/* Event location */}
                                <div className="flex items-start mb-6 p-4 bg-gray-50 dark:bg-dark-600 rounded-lg">
                                    <LocationMarkerIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">Location</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                                    </div>
                                </div>

                                {/* Event organizer */}
                                <div className="flex items-start mb-6 p-4 bg-gray-50 dark:bg-dark-600 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">Organized by</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {event.organizer ? event.organizer.username : 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                {/* Event description */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        About This Event
                                    </h3>
                                    <div className="prose dark:prose-invert prose-primary prose-img:rounded-xl max-w-none">
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Edit/Delete buttons (for organizer) */}
                                {isOrganizer && (
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600 flex flex-wrap gap-4">
                                        <Link
                                            to={`/events/${id}/edit`}
                                            className="btn-outline flex items-center"
                                        >
                                            <PencilAltIcon className="w-5 h-5 mr-1" />
                                            Edit Event
                                        </Link>

                                        <button
                                            onClick={() => setDeleteConfirmOpen(true)}
                                            className="btn-danger flex items-center"
                                        >
                                            <TrashIcon className="w-5 h-5 mr-1" />
                                            Delete Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* RSVP component (if not organizer) */}
                            {!isOrganizer && (
                                <RsvpComponent
                                    eventId={parseInt(id)}
                                    eventDate={event.date}
                                    rsvpStatus={rsvpStatus}
                                    isLoading={rsvpLoading}
                                    error={rsvpError}
                                    onRsvp={handleRsvp}
                                    onCancelRsvp={handleCancelRsvp}
                                />
                            )}

                            {/* Event dates */}
                            <div className="card p-5 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Event Date & Time
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(event.date, 'EEEE, MMMM dd, yyyy')}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formatDate(event.date, 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <LocationMarkerIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Event Location
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Share options (placeholder) */}
                            <div className="card p-5">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Share This Event
                                </h3>
                                <div className="flex space-x-2">
                                    <button className="btn-secondary flex-1">
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white dark:bg-dark-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-dark-700 p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Delete Event
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Are you sure you want to delete this event? This action cannot be undone
                                                and all RSVPs will be permanently deleted.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="btn-danger ml-3"
                                    onClick={handleDeleteEvent}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : 'Delete Event'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EventDetailsPage;