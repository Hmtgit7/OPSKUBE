import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/outline';
import { getEvents } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import EventFilter from '../components/events/EventFilter';
import Pagination from '../components/ui/Pagination';
import { toast } from 'react-toastify';

const EventsPage = () => {
  const { state: { isAuthenticated } } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    date: '',
    page: 1,
    limit: 9
  });
  const [pagination, setPagination] = useState({
    totalEvents: 0,
    totalPages: 1,
    currentPage: 1,
    eventsPerPage: 9,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch events based on filters
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await getEvents(filters);
        setEvents(response.events || []);
        setPagination(response.pagination || {
          totalEvents: 0,
          totalPages: 1,
          currentPage: 1,
          eventsPerPage: 9,
          hasNextPage: false,
          hasPrevPage: false
        });
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        toast.error('Failed to load events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  // Handle filter changes
  const handleSearch = (searchFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...searchFilters,
      page: 1, // Reset to first page on new search
    }));
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      page
    }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Events</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and join upcoming events
            </p>
          </div>
          
          {isAuthenticated && (
            <Link 
              to="/events/new" 
              className="btn-primary mt-4 md:mt-0 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Create Event
            </Link>
          )}
        </div>

        {/* Filters */}
        <EventFilter 
          initialFilters={{
            name: filters.name,
            date: filters.date
          }}
          onSearch={handleSearch}
        />

        {/* Events list */}
        <EventList 
          events={events}
          isLoading={isLoading}
          error={error}
          emptyMessage="No events found matching your criteria. Try adjusting your search or check back later."
        />

        {/* Pagination */}
        {!isLoading && !error && events.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;