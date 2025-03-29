// src/controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwtUtils';
import { AppError, handleError } from '../utils/errorUtils';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Check if user with email or username already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            throw new AppError('User with this email or username already exists', 400);
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password // Password will be hashed in User model hooks
        });

        // Generate JWT token
        const token = generateToken(user);

        // Return user data and token
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return handleError(error, res);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Validate password
        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data and token
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return handleError(error, res);
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        // User is attached to request from auth middleware
        const user = req.user;

        // Return user profile data
        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        return handleError(error, res);
    }
};