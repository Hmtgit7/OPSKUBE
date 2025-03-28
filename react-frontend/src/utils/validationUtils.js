import * as Yup from 'yup';

// User registration validation schema
export const registerValidationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .matches(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores'
        ),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
});

// User login validation schema
export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    password: Yup.string()
        .required('Password is required')
});

// Event form validation schema
export const eventValidationSchema = Yup.object({
    name: Yup.string()
        .required('Event name is required')
        .min(3, 'Event name must be at least 3 characters')
        .max(100, 'Event name must be at most 100 characters'),
    description: Yup.string()
        .required('Event description is required')
        .min(10, 'Description must be at least 10 characters'),
    date: Yup.date()
        .required('Event date is required')
        .min(
            new Date(),
            'Event date must be in the future'
        ),
    location: Yup.string()
        .required('Event location is required')
        .min(3, 'Location must be at least 3 characters')
});

// Event search validation schema
export const eventSearchValidationSchema = Yup.object({
    name: Yup.string(),
    date: Yup.date().nullable()
});

// RSVP validation schema
export const rsvpValidationSchema = Yup.object({
    status: Yup.string()
        .required('RSVP status is required')
        .oneOf(['attending', 'maybe', 'declined'], 'Invalid RSVP status')
});