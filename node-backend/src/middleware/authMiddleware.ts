// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const secretKey = process.env.JWT_SECRET as string;
        if (!secretKey) {
            console.error('WARNING: JWT_SECRET is not defined in environment variables.');
        }

        const decoded = jwt.verify(
            token,
            secretKey || 'fallback_secret_for_development_only'
        ) as { id: number };

        // Find user by id
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

// Optional middleware for routes that can be accessed by both authenticated and non-authenticated users
export const optionalAuthenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            next();
            return;
        }

        const secretKey = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(
            token,
            secretKey || 'fallback_secret_for_development_only'
        ) as { id: number };

        // Find user by id
        const user = await User.findByPk(decoded.id);

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        // If token is invalid, just continue without attaching user to request
        next();
    }
};