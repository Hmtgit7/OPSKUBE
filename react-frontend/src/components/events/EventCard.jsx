import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, LocationMarkerIcon, UserIcon } from '@heroicons/react/outline';
import { formatDate, formatRelativeTime, isDatePast } from '../../utils/dateUtils';

const EventCard = ({ event }) => {
    const isPast = isDatePast(event.date);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="h-full"
        >
            <div className="card h-full flex flex-col overflow-hidden">
                {/* Event banner with status badge */}
                <div className="relative h-40 md:h-48 bg-gradient-to-r from-primary-700 to-primary-900 flex justify-center items-center">
                    <div className="text-4xl text-white/20 font-bold">{event.name.charAt(0)}</div>

                    <div className="absolute top-3 right-3">
                        {isPast ? (
                            <span className="badge badge-neutral">Past</span>
                        ) : (
                            <span className="badge badge-success">Upcoming</span>
                        )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                        <span className="text-xs text-white/70">{formatRelativeTime(event.date)}</span>
                    </div>
                </div>

                {/* Event content */}
                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.name}</h3>

                    <div className="mb-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(event.date, 'EEEE, MMMM dd, yyyy • h:mm a')}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <LocationMarkerIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>

                        {event.organizer && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>Organized by {event.organizer.username}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {event.description}
                    </p>

                    <div className="mt-auto">
                        <Link
                            to={`/events/${event.id}`}
                            className="btn-primary w-full text-center"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;