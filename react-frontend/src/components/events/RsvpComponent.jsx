import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { isDatePast } from '../../utils/dateUtils';
import { normalizeRsvpStatus } from '../../services/rsvpService';

const RsvpComponent = ({
    eventId,
    eventDate,
    rsvpStatus,
    isLoading,
    error,
    onRsvp,
    onCancelRsvp
}) => {
    const { state: { isAuthenticated } } = useAuth();
    const [status, setStatus] = useState(normalizeRsvpStatus(rsvpStatus));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isPastEvent = isDatePast(eventDate);

    // Handle RSVP selection
    const handleRsvp = async (newStatus) => {
        if (newStatus === status) return; // No change

        setIsSubmitting(true);
        try {
            await onRsvp(newStatus);
            setStatus(newStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle RSVP cancellation
    const handleCancelRsvp = async () => {
        setIsSubmitting(true);
        try {
            await onCancelRsvp();
            setStatus(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    // If event is in the past
    if (isPastEvent) {
        return (
            <div className="card p-5">
                <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-dark-600 rounded-lg text-gray-500 dark:text-gray-400">
                    <ExclamationIcon className="h-5 w-5 mr-2" />
                    <span>This event has already taken place</span>
                </div>
            </div>
        );
    }

    // If user is not authenticated
    if (!isAuthenticated) {
        return (
            <div className="card p-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    RSVP to this Event
                </h3>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-blue-700 dark:text-blue-300 mb-4">
                    <p>You need to be logged in to RSVP to this event.</p>
                </div>
                <Link to="/login" className="btn-primary w-full text-center">
                    Log in to RSVP
                </Link>
            </div>
        );
    }

    return (
        <div className="card p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                RSVP to this Event
            </h3>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300 mb-4">
                    <p>{error}</p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center py-8"
                    >
                        <svg
                            className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400"
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="mb-4 p-2 grid grid-cols-3 gap-2">
                            <button
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${status === 'attending'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'border-gray-200 dark:border-dark-500 hover:border-green-300 dark:hover:border-green-700'
                                    }`}
                                onClick={() => handleRsvp('attending')}
                                disabled={isSubmitting}
                            >
                                <CheckIcon className={`h-6 w-6 mb-2 ${status === 'attending' ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                <span className="text-sm font-medium">Attending</span>
                            </button>

                            <button
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${status === 'maybe'
                                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                        : 'border-gray-200 dark:border-dark-500 hover:border-yellow-300 dark:hover:border-yellow-700'
                                    }`}
                                onClick={() => handleRsvp('maybe')}
                                disabled={isSubmitting}
                            >
                                <QuestionMarkCircleIcon className={`h-6 w-6 mb-2 ${status === 'maybe' ? 'text-yellow-500' : 'text-gray-400'
                                    }`} />
                                <span className="text-sm font-medium">Maybe</span>
                            </button>

                            <button
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${status === 'declined'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        : 'border-gray-200 dark:border-dark-500 hover:border-red-300 dark:hover:border-red-700'
                                    }`}
                                onClick={() => handleRsvp('declined')}
                                disabled={isSubmitting}
                            >
                                <XIcon className={`h-6 w-6 mb-2 ${status === 'declined' ? 'text-red-500' : 'text-gray-400'
                                    }`} />
                                <span className="text-sm font-medium">Declined</span>
                            </button>
                        </div>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex justify-center"
                            >
                                <button
                                    className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 underline"
                                    onClick={handleCancelRsvp}
                                    disabled={isSubmitting}
                                >
                                    Cancel RSVP
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RsvpComponent;