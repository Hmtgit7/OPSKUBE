// src/routes/attendingRoutes.js

import { Router } from 'express';
import { getAttendingEvents } from '../controllers/attendingEvents';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get events the user is attending
router.get('/attending', authenticateToken, getAttendingEvents);

export default router;