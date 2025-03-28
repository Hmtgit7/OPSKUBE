import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    Paper,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOn from "@mui/icons-material/LocationOn";
import Title from "@mui/icons-material/Title";
import Description from "@mui/icons-material/Description";;
import { EventFormData, Event } from '../../types';
import { motion } from 'framer-motion';

interface EventFormProps {
    initialValues?: EventFormData;
    onSubmit: (values: EventFormData) => Promise<void>;
    isSubmitting: boolean;
    event?: Event | null;
    isEdit?: boolean;
}

// Get minimum date (today) for the date picker
const getMinimumDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const EventForm: React.FC<EventFormProps> = ({
    initialValues = { name: '', description: '', date: '', location: '' },
    onSubmit,
    isSubmitting,
    event,
    isEdit = false,
}) => {
    // Form validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Event name is required')
            .min(3, 'Event name must be at least 3 characters')
            .max(100, 'Event name must be at most 100 characters'),
        description: Yup.string()
            .required('Event description is required')
            .min(10, 'Description must be at least 10 characters'),
        date: Yup.date()
            .required('Event date is required')
            .min(isEdit && event ? undefined : getMinimumDate(), 'Event date cannot be in the past'),
        location: Yup.string()
            .required('Event location is required')
            .min(3, 'Location must be at least 3 characters'),
    });

    // Initialize formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Paper className="bg-white dark:bg-gray-800 shadow-md p-6">
                <Typography
                    variant="h5"
                    component="h1"
                    className="text-gray-900 dark:text-white mb-6 font-bold"
                >
                    {isEdit ? 'Edit Event' : 'Create New Event'}
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid component="div" item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Event Name"
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Title className="text-gray-500 dark:text-gray-300" />
                                        </InputAdornment>
                                    ),
                                    className: "text-gray-900 dark:text-white"
                                }}
                                InputLabelProps={{
                                    className: "text-gray-600 dark:text-gray-300"
                                }}
                            />
                        </Grid>

                        <Grid component="div" item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="date"
                                name="date"
                                label="Event Date"
                                type="datetime-local"
                                variant="outlined"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.date && Boolean(formik.errors.date)}
                                helperText={formik.touched.date && formik.errors.date}
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday className="text-gray-500 dark:text-gray-300" />
                                        </InputAdornment>
                                    ),
                                    className: "text-gray-900 dark:text-white"
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    className: "text-gray-600 dark:text-gray-300"
                                }}
                            />
                        </Grid>

                        <Grid component="div" item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="location"
                                name="location"
                                label="Event Location"
                                variant="outlined"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn className="text-gray-500 dark:text-gray-300" />
                                        </InputAdornment>
                                    ),
                                    className: "text-gray-900 dark:text-white"
                                }}
                                InputLabelProps={{
                                    className: "text-gray-600 dark:text-gray-300"
                                }}
                            />
                        </Grid>

                        <Grid component="div" item xs={12}>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Event Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Description className="text-gray-500 dark:text-gray-300" />
                                        </InputAdornment>
                                    ),
                                    className: "text-gray-900 dark:text-white"
                                }}
                                InputLabelProps={{
                                    className: "text-gray-600 dark:text-gray-300"
                                }}
                            />
                        </Grid>

                        <Grid component="div" item xs={12}>
                            <Box className="flex justify-end space-x-3 mt-4">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    className="bg-primary-main hover:bg-primary-dark text-white"
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                >
                                    {isEdit ? 'Update Event' : 'Create Event'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </motion.div>
    );
};

export default EventForm;