// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import rsvpRoutes from './rsvpRoutes';

const router = Router();

// Define API routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events', rsvpRoutes); // RSVP routes are under /events/:id/rsvp

// Add route to get current user's events
// This route is also available at /events/my-events, but adding here for compatibility
router.use('/my-events', (req, res, next) => {
    req.url = '/my-events';
    eventRoutes(req, res, next);
});

export default router;