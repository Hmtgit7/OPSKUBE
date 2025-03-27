import app from './app';
import { initializeDatabase } from './models';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize database connection
        const dbInitialized = await initializeDatabase();

        if (!dbInitialized) {
            console.error('Failed to initialize database. Exiting application.');
            process.exit(1);
        }

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});