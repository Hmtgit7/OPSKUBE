import { Router } from 'express';
import {
    createRsvp,
    getEventRsvps,
    getUserRsvp,
    deleteRsvp
} from '../controllers/rsvpController';
import { createRsvpValidation } from '../utils/validationRules';
import { validate } from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// RSVP to an event (requires authentication)
router.post('/:id/rsvp', authenticateToken, validate(createRsvpValidation), createRsvp);

// Get all RSVPs for an event (requires authentication and event ownership)
router.get('/:id/rsvp', authenticateToken, getEventRsvps);

// Get current user's RSVP status for an event (requires authentication)
router.get('/:id/rsvp/me', authenticateToken, getUserRsvp);

// Delete RSVP (requires authentication)
router.delete('/:id/rsvp', authenticateToken, deleteRsvp);

export default router;