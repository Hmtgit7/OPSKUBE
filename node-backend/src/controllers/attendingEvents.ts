// src/controllers/attendingEvents.js

import { Request, Response } from 'express';
import { Event, User, RSVP } from '../models';
import { AppError, handleError } from '../utils/errorUtils';

// Get events the user is attending
export const getAttendingEvents = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        console.log(`Getting events user ${userId} is attending`);

        // Find RSVPs where the user is attending
        const rsvps = await RSVP.findAll({
            where: {
                userId,
                status: 'attending'
            }
        });

        console.log(`Found ${rsvps.length} RSVPs with 'attending' status`);

        // Get the event IDs
        const eventIds = rsvps.map(rsvp => rsvp.eventId);
        console.log('Event IDs from RSVPs:', eventIds);

        if (eventIds.length === 0) {
            return res.status(200).json([]);
        }

        // Get the events
        const events = await Event.findAll({
            where: {
                id: eventIds
            },
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }
            ]
        });

        console.log(`Found ${events.length} events the user is attending`);
        return res.status(200).json(events);
    } catch (error) {
        console.error('Error in getAttendingEvents:', error);
        return handleError(error, res);
    }
};