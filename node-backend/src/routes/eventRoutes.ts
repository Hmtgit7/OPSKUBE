// src/routes/eventRoutes.ts
import { Router } from 'express';
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
} from '../controllers/eventController';
import {
    createEventValidation,
    updateEventValidation,
    deleteEventValidation
} from '../utils/validationRules';
import { validate, validatePagination } from '../middleware/validationMiddleware';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get all events (pagination, optional authentication)
router.get('/', validatePagination, optionalAuthenticateToken, getAllEvents);

// Get single event by id (optional authentication)
router.get('/:id', optionalAuthenticateToken, getEventById);

// Get events created by the authenticated user
router.get('/my-events', authenticateToken, getMyEvents);

// Create new event (requires authentication)
router.post('/', authenticateToken, validate(createEventValidation), createEvent);

// Update event (requires authentication)
router.put('/:id', authenticateToken, validate(updateEventValidation), updateEvent);

// Delete event (requires authentication)
router.delete('/:id', authenticateToken, validate(deleteEventValidation), deleteEvent);

export default router;