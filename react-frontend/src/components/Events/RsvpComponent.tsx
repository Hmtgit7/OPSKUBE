import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
    CircularProgress
} from '@mui/material';
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import HelpOutline from "@mui/icons-material/HelpOutline";;
import { RsvpStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface RsvpComponentProps {
    eventId: number;
    eventDate: string;
    rsvpStatus: RsvpStatus;
    isLoading: boolean;
    error: string | null;
    onRsvp: (status: RsvpStatus) => Promise<void>;
    onCancelRsvp: () => Promise<void>;
}

const RsvpComponent: React.FC<RsvpComponentProps> = ({
    eventId,
    eventDate,
    rsvpStatus,
    isLoading,
    error,
    onRsvp,
    onCancelRsvp,
}) => {
    const { state: { isAuthenticated } } = useAuth();
    const [status, setStatus] = useState<RsvpStatus>(rsvpStatus);
    const [processing, setProcessing] = useState(false);

    // Check if event is in the past
    const isEventPast = new Date(eventDate) < new Date();

    const handleStatusChange = async (
        event: React.MouseEvent<HTMLElement>,
        newStatus: RsvpStatus,
    ) => {
        if (newStatus === null) return;

        setProcessing(true);
        try {
            await onRsvp(newStatus);
            setStatus(newStatus);
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelRsvp = async () => {
        setProcessing(true);
        try {
            await onCancelRsvp();
            setStatus(null);
        } finally {
            setProcessing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Paper className="bg-white dark:bg-gray-800 shadow-md p-5 mb-6">
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-3">
                    RSVP to this Event
                </Typography>
                <Alert severity="info" className="mb-3">
                    Please log in to RSVP to this event.
                </Alert>
                <Box className="flex justify-center">
                    <Button
                        variant="contained"
                        href="/login"
                        className="bg-primary-main hover:bg-primary-dark text-white"
                    >
                        Login to RSVP
                    </Button>
                </Box>
            </Paper>
        );
    }

    if (isEventPast) {
        return (
            <Paper className="bg-white dark:bg-gray-800 shadow-md p-5 mb-6">
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-3">
                    Event RSVP
                </Typography>
                <Alert severity="warning">
                    This event has already taken place and is no longer accepting RSVPs.
                </Alert>
            </Paper>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Paper className="bg-white dark:bg-gray-800 shadow-md p-5 mb-6">
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                    RSVP to this Event
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <Box className="flex justify-center py-4">
                            <CircularProgress size={30} className="text-primary-main" />
                        </Box>
                    ) : (
                        <motion.div
                            key="rsvp-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box className="flex flex-col space-y-4">
                                <Typography variant="body1" className="text-gray-700 dark:text-gray-300">
                                    Let the organizer know if you're attending:
                                </Typography>

                                <ToggleButtonGroup
                                    value={status}
                                    exclusive
                                    onChange={handleStatusChange}
                                    aria-label="RSVP status"
                                    disabled={processing}
                                    className="self-center"
                                >
                                    <ToggleButton
                                        value="attending"
                                        aria-label="attending"
                                        className={`px-4 py-2 ${status === 'attending'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <CheckCircle className="mr-1" fontSize="small" />
                                        Attending
                                    </ToggleButton>

                                    <ToggleButton
                                        value="maybe"
                                        aria-label="maybe"
                                        className={`px-4 py-2 ${status === 'maybe'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <HelpOutline className="mr-1" fontSize="small" />
                                        Maybe
                                    </ToggleButton>

                                    <ToggleButton
                                        value="declined"
                                        aria-label="declined"
                                        className={`px-4 py-2 ${status === 'declined'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <Cancel className="mr-1" fontSize="small" />
                                        Not Attending
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex justify-center mt-2"
                                    >
                                        <Button
                                            variant="text"
                                            onClick={handleCancelRsvp}
                                            disabled={processing}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Cancel RSVP
                                        </Button>
                                    </motion.div>
                                )}
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>
        </motion.div>
    );
};

export default RsvpComponent;