import sequelize from '../config/database';
import User from './User';
import Event from './Event';
import RSVP from './RSVP';

// Export models
export { User, Event, RSVP };

// Initialize database
export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync all models
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('All models were synchronized successfully.');

        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
};

export default sequelize;