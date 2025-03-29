/**
 * Seed script for the Node.js backend (CommonJS version)
 * Run with: npx ts-node src/scripts/seed-commonjs.js
 */

const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection from environment variables with fallbacks
const dbName = 'event_hub_mtw7';
const dbUser = 'hemant';
const dbPassword = 'ESs87hQnJ8bfghlyiFAkwj7nzggQxw0s';
const dbHost = 'dpg-cvj9dna4d50c73940n4g-a.oregon-postgres.render.com';
const dbPort = 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5, // Maximum number of connection in pool
        min: 0, // Minimum number of connection in pool
        acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
        evict: 1000 // The interval at which to check for idle connections to evict
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Important for connecting to Render's PostgreSQL
        },
        connectTimeout: 60000 // Increasing timeout
    },
    retry: {
        max: 3, // Maximum retry attempts
        backoffBase: 1000, // Base delay in ms
        backoffExponent: 1.5 // Exponential factor
    }
});

// Define models
const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

const Event = sequelize.define('Event', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    tableName: 'events',
    timestamps: true,
});

const RSVP = sequelize.define('RSVP', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
    status: {
        type: Sequelize.ENUM('attending', 'maybe', 'declined'),
        allowNull: false,
        defaultValue: 'attending',
    },
}, {
    tableName: 'rsvps',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'eventId'],
        },
    ],
});

// Define associations
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'organizer' });

User.belongsToMany(Event, { through: RSVP, foreignKey: 'userId', as: 'attendingEvents' });
Event.belongsToMany(User, { through: RSVP, foreignKey: 'eventId', as: 'attendees' });

// Test database connection before proceeding
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
};

const seedDatabase = async (retries = 5) => {
    try {
        // Test connection first
        const connectionSuccessful = await testConnection();
        if (!connectionSuccessful) {
            throw new Error('Failed to establish database connection');
        }

        // Sync models with database (with lower force for safety)
        await sequelize.sync({ force: true });
        console.log('Database synced');

        // Create users
        const password = await bcrypt.hash('password123', 10);
        const users = await User.bulkCreate([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password
            },
            {
                username: 'bob_johnson',
                email: 'bob@example.com',
                password
            },
            {
                username: 'alice_green',
                email: 'alice@example.com',
                password
            },
            {
                username: 'mike_brown',
                email: 'mike@example.com',
                password
            }
        ]);
        console.log(`Created ${users.length} users`);

        // Create events
        const events = await Event.bulkCreate([
            {
                name: 'Tech Conference 2025',
                description: 'Annual technology conference featuring the latest innovations',
                date: new Date('2025-06-15T09:00:00'),
                location: 'San Francisco Convention Center',
                userId: 1
            },
            {
                name: 'Summer Music Festival',
                description: 'Outdoor music festival with top artists',
                date: new Date('2025-07-20T17:00:00'),
                location: 'Central Park',
                userId: 2
            },
            {
                name: 'Data Science Workshop',
                description: 'Hands-on workshop for data analysis and machine learning',
                date: new Date('2025-05-10T10:00:00'),
                location: 'Tech Hub Downtown',
                userId: 1
            },
            {
                name: 'Charity Run',
                description: '5K run to raise funds for local charities',
                date: new Date('2025-04-05T08:00:00'),
                location: 'City Park',
                userId: 3
            },
            {
                name: 'Art Exhibition',
                description: 'Exhibition of contemporary art from local artists',
                date: new Date('2025-08-12T18:30:00'),
                location: 'Metropolitan Art Gallery',
                userId: 4
            },
            {
                name: 'Business Networking',
                description: 'Connect with professionals in your industry',
                date: new Date('2025-05-25T19:00:00'),
                location: 'Grand Hotel Conference Room',
                userId: 5
            },
            {
                name: 'Yoga Retreat',
                description: 'Weekend of yoga and meditation',
                date: new Date('2025-09-18T08:00:00'),
                location: 'Mountain View Resort',
                userId: 2
            },
            {
                name: 'Book Club Meeting',
                description: 'Discussion of this month\'s book selection',
                date: new Date('2025-04-30T18:00:00'),
                location: 'City Library',
                userId: 4
            },
            {
                name: 'Food Festival',
                description: 'Taste dishes from top local restaurants',
                date: new Date('2025-10-10T12:00:00'),
                location: 'Downtown Food Court',
                userId: 3
            },
            {
                name: 'Career Fair',
                description: 'Meet recruiters from top companies',
                date: new Date('2025-06-28T10:00:00'),
                location: 'University Campus',
                userId: 5
            }
        ]);
        console.log(`Created ${events.length} events`);

        // Create RSVPs
        const rsvps = await RSVP.bulkCreate([
            { userId: 2, eventId: 1, status: 'attending' },
            { userId: 3, eventId: 1, status: 'attending' },
            { userId: 4, eventId: 1, status: 'maybe' },
            { userId: 5, eventId: 1, status: 'attending' },
            { userId: 1, eventId: 2, status: 'attending' },
            { userId: 3, eventId: 2, status: 'declined' },
            { userId: 4, eventId: 2, status: 'attending' },
            { userId: 2, eventId: 3, status: 'attending' },
            { userId: 4, eventId: 3, status: 'attending' },
            { userId: 5, eventId: 3, status: 'maybe' },
            { userId: 1, eventId: 4, status: 'attending' },
            { userId: 2, eventId: 4, status: 'attending' },
            { userId: 5, eventId: 4, status: 'attending' },
            { userId: 1, eventId: 5, status: 'maybe' },
            { userId: 2, eventId: 5, status: 'attending' },
            { userId: 3, eventId: 5, status: 'attending' },
            { userId: 1, eventId: 6, status: 'attending' },
            { userId: 2, eventId: 6, status: 'declined' },
            { userId: 3, eventId: 6, status: 'maybe' },
            { userId: 4, eventId: 6, status: 'attending' }
        ]);
        console.log(`Created ${rsvps.length} RSVPs`);

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error(`Error seeding database (attempts left: ${retries}):`, error);
        if (retries > 0) {
            console.log(`Retrying in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return seedDatabase(retries - 1);
        } else {
            console.error('Maximum retry attempts reached. Giving up.');
        }
    } finally {
        await sequelize.close();
    }
};

// Execute the seed function
seedDatabase();



// /**
//  * Seed script for the Node.js backend (CommonJS version)
//  * Run with: npx ts-node src/scripts/seed-commonjs.js
//  */

// const bcrypt = require('bcrypt');
// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// // PGPASSWORD=ESs87hQnJ8bfghlyiFAkwj7nzggQxw0s psql -h dpg-cvj9dna4d50c73940n4g-a.oregon-postgres.render.com -U hemant event_hub_mtw7
// // Database connection
// const dbName = 'event_hub_mtw7';
// const dbUser = 'hemant';
// const dbPassword = 'ESs87hQnJ8bfghlyiFAkwj7nzggQxw0s';
// const dbHost = 'dpg-cvj9dna4d50c73940n4g-a.oregon-postgres.render.com';
// const dbPort = 5432;

// const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//     host: dbHost,
//     port: dbPort,
//     dialect: 'postgres',
//     logging: false,
// });

// // Define models
// const User = sequelize.define('User', {
//     username: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true,
//         },
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
// }, {
//     tableName: 'users',
//     timestamps: true,
// });

// const Event = sequelize.define('Event', {
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//     },
//     date: {
//         type: Sequelize.DATE,
//         allowNull: false,
//     },
//     location: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'users',
//             key: 'id',
//         },
//     },
// }, {
//     tableName: 'events',
//     timestamps: true,
// });

// const RSVP = sequelize.define('RSVP', {
//     userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'users',
//             key: 'id',
//         },
//     },
//     eventId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'events',
//             key: 'id',
//         },
//     },
//     status: {
//         type: Sequelize.ENUM('attending', 'maybe', 'declined'),
//         allowNull: false,
//         defaultValue: 'attending',
//     },
// }, {
//     tableName: 'rsvps',
//     timestamps: true,
//     indexes: [
//         {
//             unique: true,
//             fields: ['userId', 'eventId'],
//         },
//     ],
// });

// // Define associations
// User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
// Event.belongsTo(User, { foreignKey: 'userId', as: 'organizer' });

// User.belongsToMany(Event, { through: RSVP, foreignKey: 'userId', as: 'attendingEvents' });
// Event.belongsToMany(User, { through: RSVP, foreignKey: 'eventId', as: 'attendees' });

// const seedDatabase = async () => {
//     try {
//         // Sync models with database
//         await sequelize.sync({ force: true });
//         console.log('Database synced');

//         // Create users
//         const password = await bcrypt.hash('password123', 10);
//         const users = await User.bulkCreate([
//             {
//                 username: 'john_doe',
//                 email: 'john@example.com',
//                 password
//             },
//             {
//                 username: 'jane_smith',
//                 email: 'jane@example.com',
//                 password
//             },
//             {
//                 username: 'bob_johnson',
//                 email: 'bob@example.com',
//                 password
//             },
//             {
//                 username: 'alice_green',
//                 email: 'alice@example.com',
//                 password
//             },
//             {
//                 username: 'mike_brown',
//                 email: 'mike@example.com',
//                 password
//             }
//         ]);
//         console.log(`Created ${users.length} users`);

//         // Create events
//         const events = await Event.bulkCreate([
//             {
//                 name: 'Tech Conference 2025',
//                 description: 'Annual technology conference featuring the latest innovations',
//                 date: new Date('2025-06-15T09:00:00'),
//                 location: 'San Francisco Convention Center',
//                 userId: 1
//             },
//             {
//                 name: 'Summer Music Festival',
//                 description: 'Outdoor music festival with top artists',
//                 date: new Date('2025-07-20T17:00:00'),
//                 location: 'Central Park',
//                 userId: 2
//             },
//             {
//                 name: 'Data Science Workshop',
//                 description: 'Hands-on workshop for data analysis and machine learning',
//                 date: new Date('2025-05-10T10:00:00'),
//                 location: 'Tech Hub Downtown',
//                 userId: 1
//             },
//             {
//                 name: 'Charity Run',
//                 description: '5K run to raise funds for local charities',
//                 date: new Date('2025-04-05T08:00:00'),
//                 location: 'City Park',
//                 userId: 3
//             },
//             {
//                 name: 'Art Exhibition',
//                 description: 'Exhibition of contemporary art from local artists',
//                 date: new Date('2025-08-12T18:30:00'),
//                 location: 'Metropolitan Art Gallery',
//                 userId: 4
//             },
//             {
//                 name: 'Business Networking',
//                 description: 'Connect with professionals in your industry',
//                 date: new Date('2025-05-25T19:00:00'),
//                 location: 'Grand Hotel Conference Room',
//                 userId: 5
//             },
//             {
//                 name: 'Yoga Retreat',
//                 description: 'Weekend of yoga and meditation',
//                 date: new Date('2025-09-18T08:00:00'),
//                 location: 'Mountain View Resort',
//                 userId: 2
//             },
//             {
//                 name: 'Book Club Meeting',
//                 description: 'Discussion of this month\'s book selection',
//                 date: new Date('2025-04-30T18:00:00'),
//                 location: 'City Library',
//                 userId: 4
//             },
//             {
//                 name: 'Food Festival',
//                 description: 'Taste dishes from top local restaurants',
//                 date: new Date('2025-10-10T12:00:00'),
//                 location: 'Downtown Food Court',
//                 userId: 3
//             },
//             {
//                 name: 'Career Fair',
//                 description: 'Meet recruiters from top companies',
//                 date: new Date('2025-06-28T10:00:00'),
//                 location: 'University Campus',
//                 userId: 5
//             }
//         ]);
//         console.log(`Created ${events.length} events`);

//         // Create RSVPs
//         const rsvps = await RSVP.bulkCreate([
//             { userId: 2, eventId: 1, status: 'attending' },
//             { userId: 3, eventId: 1, status: 'attending' },
//             { userId: 4, eventId: 1, status: 'maybe' },
//             { userId: 5, eventId: 1, status: 'attending' },
//             { userId: 1, eventId: 2, status: 'attending' },
//             { userId: 3, eventId: 2, status: 'declined' },
//             { userId: 4, eventId: 2, status: 'attending' },
//             { userId: 2, eventId: 3, status: 'attending' },
//             { userId: 4, eventId: 3, status: 'attending' },
//             { userId: 5, eventId: 3, status: 'maybe' },
//             { userId: 1, eventId: 4, status: 'attending' },
//             { userId: 2, eventId: 4, status: 'attending' },
//             { userId: 5, eventId: 4, status: 'attending' },
//             { userId: 1, eventId: 5, status: 'maybe' },
//             { userId: 2, eventId: 5, status: 'attending' },
//             { userId: 3, eventId: 5, status: 'attending' },
//             { userId: 1, eventId: 6, status: 'attending' },
//             { userId: 2, eventId: 6, status: 'declined' },
//             { userId: 3, eventId: 6, status: 'maybe' },
//             { userId: 4, eventId: 6, status: 'attending' }
//         ]);
//         console.log(`Created ${rsvps.length} RSVPs`);

//         console.log('Database seeding completed successfully');
//     } catch (error) {
//         console.error('Error seeding database:', error);
//     } finally {
//         await sequelize.close();
//     }
// };

// seedDatabase();