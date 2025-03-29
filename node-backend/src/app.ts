import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { handleError } from './utils/errorUtils';
import { RSVP } from './models';
import { authenticateToken } from './middleware/authMiddleware';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// API Routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Event Management API',
        documentation: '/api-docs'
    });
});

// Fallback route for events the user is attending
app.get('/api/events/attending/fallback', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all RSVPs for this user with status 'attending'
        const rsvps = await RSVP.findAll({
            where: {
                userId,
                status: 'attending'
            }
        });

        // Extract event IDs
        const eventIds = rsvps.map(rsvp => rsvp.eventId);

        // Return the event IDs
        return res.status(200).json({ eventIds });
    } catch (error) {
        console.error('Fallback attending events error:', error);
        return res.status(500).json({ message: 'Error in fallback route' });
    }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;