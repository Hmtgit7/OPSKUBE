// src/controllers/eventController.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Event, RSVP, User } from '../models';
import { AppError, handleError } from '../utils/errorUtils';

// Get all events with pagination and search
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const searchName = req.query.name as string;
        const searchDate = req.query.date as string;

        // Build search conditions
        const whereConditions: any = {};

        if (searchName) {
            whereConditions.name = {
                [Op.iLike]: `%${searchName}%`
            };
        }

        if (searchDate) {
            // Assuming date is in format YYYY-MM-DD
            const startDate = new Date(searchDate);
            const endDate = new Date(searchDate);
            endDate.setDate(endDate.getDate() + 1);

            whereConditions.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Get events with pagination
        const { count, rows: events } = await Event.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ],
            order: [['date', 'ASC']],
            limit,
            offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            events,
            pagination: {
                totalEvents: count,
                totalPages,
                currentPage: page,
                eventsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error in getAllEvents:', error);
        return handleError(error, res);
    }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ]
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        return res.status(200).json({ event });
    } catch (error) {
        return handleError(error, res);
    }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { name, description, date, location } = req.body;

        // Make sure req.user exists and has an id
        if (!req.user || !req.user.id) {
            throw new AppError('Authentication required', 401);
        }

        const userId = req.user.id;

        const event = await Event.create({
            name,
            description,
            date: new Date(date),
            location,
            userId
        });

        // After successful creation, fetch the complete event with organizer info
        const createdEvent = await Event.findByPk(event.id, {
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ]
        });

        return res.status(201).json({
            message: 'Event created successfully',
            event: createdEvent
        });
    } catch (error) {
        console.error('Error in createEvent:', error);
        return handleError(error, res);
    }
};

// Update an existing event
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, date, location } = req.body;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findByPk(id);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        // Check if user is the owner of the event
        if (event.userId !== userId) {
            throw new AppError('You do not have permission to update this event', 403);
        }

        // Update event
        await event.update({
            name,
            description,
            date: new Date(date),
            location
        });

        // Get updated event with organizer info
        const updatedEvent = await Event.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ]
        });

        return res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        return handleError(error, res);
    }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findByPk(id);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        // Check if user is the owner of the event
        if (event.userId !== userId) {
            throw new AppError('You do not have permission to delete this event', 403);
        }

        // Delete event
        await event.destroy();

        return res.status(200).json({
            message: 'Event deleted successfully'
        });
    } catch (error) {
        return handleError(error, res);
    }
};

// Get events created by current user
// export const getMyEvents = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user.id;

//         const events = await Event.findAll({
//             where: { userId },
//             include: [
//                 {
//                     model: User,
//                     as: 'organizer',
//                     attributes: ['id', 'username']
//                 }
//             ],
//             order: [['date', 'ASC']]
//         });

//         return res.status(200).json(events);
//     } catch (error) {
//         console.error('Error in getMyEvents:', error);
//         return handleError(error, res);
//     }
// };

export const getMyEvents = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        console.log(`Fetching events for user ID: ${userId}`);

        const events = await Event.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ],
            order: [['date', 'ASC']]
        });

        console.log(`Found ${events.length} events created by the user`);
        return res.status(200).json(events);
    } catch (error) {
        console.error('Error in getMyEvents:', error);
        return handleError(error, res);
    }
};