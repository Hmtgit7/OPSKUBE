import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import rsvpRoutes from './rsvpRoutes';

const router = Router();

// Define API routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events', rsvpRoutes); // RSVP routes are under /events/:id/rsvp

export default router;