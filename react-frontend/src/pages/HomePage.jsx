import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  SearchIcon, 
  UserGroupIcon, 
  LocationMarkerIcon 
} from '@heroicons/react/outline';
import { getEvents } from '../services/eventService';
import Layout from '../components/layout/Layout';
import EventCard from '../components/events/EventCard';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { state: { isAuthenticated } } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setIsLoading(true);
      try {
        const response = await getEvents({ limit: 3 });
        setUpcomingEvents(response.events || []);
        setError(null);
      } catch (err) {
        setError('Failed to load upcoming events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] bg-cover opacity-10"></div> */}
          <div className="absolute inset-0 bg-cover opacity-10"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Discover & Create Amazing Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-200 mb-8"
            >
              Join our community to find, create, and manage events that matter to you
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/events" 
                className="btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100"
              >
                Browse Events
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/events/new" 
                  className="btn-outline btn-lg border-white text-white hover:bg-white/10"
                >
                  Create Event
                </Link>
              ) : (
                <Link 
                  to="/register" 
                  className="btn-outline btn-lg border-white text-white hover:bg-white/10"
                >
                  Sign Up
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EventHub?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform makes event management simple and enjoyable for everyone
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 h-full">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Event Creation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and customize your events with all the details you need in minutes
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 h-full">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Discover Events</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find events that match your interests with powerful search features
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 h-full">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">RSVP Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep track of who's attending your events with our simple RSVP system
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 h-full">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LocationMarkerIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location Flexibility</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Host events in physical locations or virtual spaces with equal ease
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Discover what's happening soon
              </p>
            </div>
            <Link 
              to="/events" 
              className="btn-primary mt-4 md:mt-0"
            >
              View All Events
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading placeholders
              [...Array(3)].map((_, index) => (
                <div key={index} className="card h-96 animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-dark-600 rounded-t-xl"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
                    </div>
                    <div className="h-20 bg-gray-200 dark:bg-dark-600 rounded"></div>
                    <div className="h-10 bg-gray-200 dark:bg-dark-600 rounded"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-lg">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            ) : upcomingEvents.length === 0 ? ( 
              // Empty state
              <div className="col-span-full">
                <div className="text-center py-12 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                  <CalendarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No upcoming events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Be the first to create an event!
                  </p>
                  <Link to="/events/new" className="btn-primary">
                    Create Event
                  </Link>
                </div>
              </div>
            ) : (
              // Events list
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our growing community and start creating memorable events today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/events/new" className="btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100">
                Create Your First Event
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100">
                  Sign Up for Free
                </Link>
                <Link to="/login" className="btn-outline btn-lg border-white text-white hover:bg-white/10">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;