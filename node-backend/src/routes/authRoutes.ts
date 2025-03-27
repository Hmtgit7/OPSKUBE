import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { registerValidation, loginValidation } from '../utils/validationRules';
import { validate } from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Register a new user
router.post('/register', validate(registerValidation), register);

// Login user
router.post('/login', validate(loginValidation), login);

// Get user profile (requires authentication)
router.get('/profile', authenticateToken, getProfile);

export default router;