import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

// Middleware to validate requests and handle validation errors
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({ errors: errors.array() });
    };
};

// Middleware to validate pagination parameters
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    // Get page and limit from query parameters, provide defaults if not specified
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validate if page and limit are valid numbers
    if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: 'Page must be a positive number.' });
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ message: 'Limit must be between 1 and 100.' });
    }

    // Attach validated pagination parameters to request
    req.query.page = page.toString();
    req.query.limit = limit.toString();

    next();
};