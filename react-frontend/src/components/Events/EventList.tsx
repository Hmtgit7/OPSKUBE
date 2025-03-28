import React from 'react';
import { Grid, Box, Typography, CircularProgress, Pagination, Alert } from '@mui/material';
import { Event } from '../../types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}) => {
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-16">
        <CircularProgress size={40} className="text-primary-main" />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (events.length === 0) {
    return (
      <Box className="text-center py-16">
        <Typography variant="h6" className="text-gray-600 dark:text-gray-300 mb-2">
          No events found
        </Typography>
        <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
          Try adjusting your search filters or check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid component="div" item key={event.id} xs={12} sm={6} md={4} className="h-full">
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            className="pagination-dark"
          />
        </Box>
      )}
    </Box>
  );
};

export default EventList;