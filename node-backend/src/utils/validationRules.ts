import { body, param } from 'express-validator';

// Auth validation rules
export const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

// Event validation rules
export const createEventValidation = [
    body('name')
        .notEmpty().withMessage('Event name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Event name must be between 3 and 100 characters'),

    body('description')
        .notEmpty().withMessage('Event description is required'),

    body('date')
        .notEmpty().withMessage('Event date is required')
        .isISO8601().withMessage('Please provide a valid date in ISO format (YYYY-MM-DD)'),

    body('location')
        .notEmpty().withMessage('Event location is required')
];

export const updateEventValidation = [
    param('id')
        .isNumeric().withMessage('Event ID must be a number'),

    body('name')
        .notEmpty().withMessage('Event name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Event name must be between 3 and 100 characters'),

    body('description')
        .notEmpty().withMessage('Event description is required'),

    body('date')
        .notEmpty().withMessage('Event date is required')
        .isISO8601().withMessage('Please provide a valid date in ISO format (YYYY-MM-DD)'),

    body('location')
        .notEmpty().withMessage('Event location is required')
];

export const deleteEventValidation = [
    param('id')
        .isNumeric().withMessage('Event ID must be a number')
];

// RSVP validation rules
export const createRsvpValidation = [
    param('id')
        .isNumeric().withMessage('Event ID must be a number'),

    body('status')
        .notEmpty().withMessage('RSVP status is required')
        .isIn(['attending', 'maybe', 'declined']).withMessage('RSVP status must be one of: attending, maybe, declined')
];