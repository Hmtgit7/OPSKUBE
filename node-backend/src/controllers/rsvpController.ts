import { Request, Response } from 'express';
import { Event, RSVP, User } from '../models';
import { AppError, handleError } from '../utils/errorUtils';

// RSVP to an event
export const createRsvp = async (req: Request, res: Response) => {
    try {
        const { id: eventId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        // Check if user already RSVPed to this event
        let rsvp = await RSVP.findOne({
            where: {
                userId,
                eventId
            }
        });

        if (rsvp) {
            // Update existing RSVP
            await rsvp.update({ status });

            return res.status(200).json({
                message: 'RSVP updated successfully',
                rsvp
            });
        } else {
            // Create new RSVP
            rsvp = await RSVP.create({
                userId,
                eventId: parseInt(eventId, 10),
                status
            });

            return res.status(201).json({
                message: 'RSVP created successfully',
                rsvp
            });
        }
    } catch (error) {
        return handleError(error, res);
    }
};

// Get all RSVPs for an event
export const getEventRsvps = async (req: Request, res: Response) => {
    try {
        const { id: eventId } = req.params;

        // Check if event exists
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        // Check if user is the owner of the event
        if (event.userId !== req.user.id) {
            throw new AppError('You do not have permission to view RSVPs for this event', 403);
        }

        // Get all RSVPs for this event
        const rsvps = await RSVP.findAll({
            where: { eventId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                }
            ]
        });

        return res.status(200).json({ rsvps });
    } catch (error) {
        return handleError(error, res);
    }
};

// Get RSVP status for current user for an event
export const getUserRsvp = async (req: Request, res: Response) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        // Get RSVP for user and event
        const rsvp = await RSVP.findOne({
            where: {
                userId,
                eventId
            }
        });

        if (!rsvp) {
            return res.status(200).json({
                rsvpStatus: null
            });
        }

        return res.status(200).json({
            rsvpStatus: rsvp.status
        });
    } catch (error) {
        return handleError(error, res);
    }
};

// Delete RSVP
export const deleteRsvp = async (req: Request, res: Response) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        // Check if RSVP exists
        const rsvp = await RSVP.findOne({
            where: {
                userId,
                eventId
            }
        });

        if (!rsvp) {
            throw new AppError('RSVP not found', 404);
        }

        // Delete RSVP
        await rsvp.destroy();

        return res.status(200).json({
            message: 'RSVP removed successfully'
        });
    } catch (error) {
        return handleError(error, res);
    }
};