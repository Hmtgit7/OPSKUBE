import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import Add from "@mui/icons-material/Add";;
import Layout from '../components/Layout/Layout';
import EventList from '../components/Events/EventList';
import EventFilter from '../components/Events/EventFilter';
import { useEvents } from '../hooks/useEvents';
import { EventFilter as EventFilterType } from '../types';
import { useAuth } from '../context/AuthContext';

const Events: React.FC = () => {
    const { state: { isAuthenticated } } = useAuth();

    // Initial filter values
    const [filter, setFilter] = useState<EventFilterType>({
        page: 1,
        limit: 9,
    });

    // Fetch events using custom hook
    const { events, pagination, isLoading, error, fetchEvents } = useEvents(filter);

    // Handle filter changes
    const handleFilterChange = (newFilter: EventFilterType) => {
        setFilter(newFilter);
        fetchEvents(newFilter);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        const newFilter = { ...filter, page };
        setFilter(newFilter);
        fetchEvents(newFilter);
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Typography
                        variant="h4"
                        component="h1"
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
                    >
                        Browse Events
                    </Typography>

                    {isAuthenticated && (
                        <Button
                            component={Link}
                            to="/events/new"
                            variant="contained"
                            startIcon={<Add />}
                            className="bg-primary-main hover:bg-primary-dark text-white self-start sm:self-auto"
                        >
                            Create Event
                        </Button>
                    )}
                </Box>

                <EventFilter
                    filter={filter}
                    onFilterChange={handleFilterChange}
                />

                <EventList
                    events={events}
                    isLoading={isLoading}
                    error={error}
                    page={pagination?.currentPage || 1}
                    totalPages={pagination?.totalPages || 1}
                    onPageChange={handlePageChange}
                />
            </Container>
        </Layout>
    );
};

export default Events;