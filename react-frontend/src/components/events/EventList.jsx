import { motion } from 'framer-motion';
import EventCard from './EventCard';
import { CalendarIcon } from '@heroicons/react/outline';

const EventList = ({ events, isLoading, error, emptyMessage }) => {
    // Animations for container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary-600 dark:text-primary-400 mx-auto mb-4"
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
                    <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-lg">
                <p className="font-medium">Error loading events</p>
                <p className="mt-1">{error}</p>
            </div>
        );
    }

    // Empty state
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                <div className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-600 mb-4">
                    <CalendarIcon className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {emptyMessage || "We couldn't find any events matching your criteria. Try adjusting your search or check back later."}
                </p>
            </div>
        );
    }

    // Events list
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {events.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                    <EventCard event={event} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default EventList;