import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Grid,
    Chip,
    Divider,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import {
    CalendarToday,
    AccessTime,
    LocationOn,
    Person,
    Edit,
    Delete,
    ArrowBack
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import RsvpComponent from '../components/Events/RsvpComponent';
import { useEvent } from '../hooks/useEvent';
import { useRsvp } from '../hooks/useRsvp';
import { useAuth } from '../context/AuthContext';
import * as EventService from '../services/eventService';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = parseInt(id || '0');
    const navigate = useNavigate();

    const { state: { user, isAuthenticated } } = useAuth();
    const { event, isLoading, error, fetchEvent } = useEvent(eventId);
    const {
        rsvpStatus,
        isLoading: rsvpLoading,
        error: rsvpError,
        submitRsvp,
        cancelRsvp
    } = useRsvp(eventId);

    // State for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Check if current user is the event organizer
    const isOrganizer = event && user ? event.userId === user.id : false;

    // Format date and time if event exists
    const formattedDate = event ? format(new Date(event.date), 'EEEE, MMMM dd, yyyy') : '';
    const formattedTime = event ? format(new Date(event.date), 'h:mm a') : '';

    // Handle event deletion
    const handleDeleteEvent = async () => {
        if (!event) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await EventService.deleteEvent(event.id);
            setDeleteDialogOpen(false);
            navigate('/events');
        } catch (err: any) {
            setDeleteError(err.message || 'Failed to delete event');
        } finally {
            setIsDeleting(false);
        }
    };

    // Show delete confirmation dialog
    const showDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    // Hide delete confirmation dialog
    const hideDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    if (isLoading) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Box className="flex items-center justify-center py-16">
                        <CircularProgress size={40} className="text-primary-main" />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (error || !event) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Alert severity="error" className="mb-4">
                        {error || 'Event not found'}
                    </Alert>
                    <Button
                        component={Link}
                        to="/events"
                        startIcon={<ArrowBack />}
                        className="text-primary-main"
                    >
                        Back to Events
                    </Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                {/* Event Header */}
                <Box className="mb-6">
                    <Button
                        component={Link}
                        to="/events"
                        startIcon={<ArrowBack />}
                        className="text-primary-main mb-4"
                    >
                        Back to Events
                    </Button>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    {event.name}
                                </Typography>

                                {new Date(event.date) > new Date() ? (
                                    <Chip
                                        label="Upcoming"
                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-4"
                                    />
                                ) : (
                                    <Chip
                                        label="Past"
                                        className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mb-4"
                                    />
                                )}
                            </motion.div>
                        </Grid>

                        {isOrganizer && (
                            <Grid item xs={12} md={4} className="flex justify-start md:justify-end">
                                <Box className="flex space-x-2">
                                    <Button
                                        component={Link}
                                        to={`/events/${event.id}/edit`}
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={showDeleteDialog}
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {/* Event Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Paper className="bg-white dark:bg-gray-800 shadow-md p-6 mb-6">
                                <Box className="mb-6">
                                    <Typography
                                        variant="h6"
                                        className="text-gray-900 dark:text-white font-bold mb-4"
                                    >
                                        Event Details
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                                                <CalendarToday className="mr-2" />
                                                <Typography variant="body1">{formattedDate}</Typography>
                                            </Box>

                                            <Box className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                                                <AccessTime className="mr-2" />
                                                <Typography variant="body1">{formattedTime}</Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                                                <LocationOn className="mr-2" />
                                                <Typography variant="body1">{event.location}</Typography>
                                            </Box>

                                            <Box className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                                                <Person className="mr-2" />
                                                <Typography variant="body1">
                                                    Organized by {event.organizer?.username || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider className="my-4 dark:border-gray-700" />

                                <Box>
                                    <Typography
                                        variant="h6"
                                        className="text-gray-900 dark:text-white font-bold mb-3"
                                    >
                                        Description
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        className="text-gray-700 dark:text-gray-300 whitespace-pre-line"
                                    >
                                        {event.description}
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* RSVP Component */}
                        {!isOrganizer && (
                            <RsvpComponent
                                eventId={event.id}
                                eventDate={event.date}
                                rsvpStatus={rsvpStatus}
                                isLoading={rsvpLoading}
                                error={rsvpError}
                                onRsvp={submitRsvp}
                                onCancelRsvp={cancelRsvp}
                            />
                        )}

                        {/* Event Created Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Paper className="bg-white dark:bg-gray-800 shadow-md p-5">
                                <Typography
                                    variant="body2"
                                    className="text-gray-500 dark:text-gray-400"
                                >
                                    Event created on {format(new Date(event.createdAt || Date.now()), 'MMMM dd, yyyy')}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={hideDeleteDialog}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    PaperProps={{
                        className: "bg-white dark:bg-gray-800"
                    }}
                >
                    <DialogTitle id="delete-dialog-title" className="text-gray-900 dark:text-white">
                        Delete Event
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description" className="text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete "{event.name}"? This action cannot be undone.
                        </DialogContentText>
                        {deleteError && (
                            <Alert severity="error" className="mt-3">
                                {deleteError}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={hideDeleteDialog}
                            className="text-gray-700 dark:text-gray-300"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteEvent}
                            color="error"
                            className="text-red-500"
                            disabled={isDeleting}
                            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default EventDetails;