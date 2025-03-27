import { Response } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (err: any, res: Response) => {
    // Operational, trusted error: send message to client
    if (err instanceof AppError && err.isOperational) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Programming or other unknown error: don't leak error details
    // Log the error for server side debugging
    console.error('ERROR 💥', err);

    // Send generic message to client
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
};