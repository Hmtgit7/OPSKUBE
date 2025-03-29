import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import rsvpRoutes from './rsvpRoutes';
import attendingRoutes from './attendingRoutes';

const router = Router();

// Define API routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events', rsvpRoutes); // RSVP routes are under /events/:id/rsvp
router.use('/events', attendingRoutes); // Attending routes under /events/attending

// Alternative routes for compatibility
router.get('/my-events', (req, res, next) => {
    req.url = '/my-events';
    eventRoutes(req, res, next);
});

router.get('/attending-events', (req, res, next) => {
    req.url = '/attending';
    attendingRoutes(req, res, next);
});

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Root route
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Event Management API',
        version: '1.0.0',
        documentation: '/api-docs'
    });
});

export default router;