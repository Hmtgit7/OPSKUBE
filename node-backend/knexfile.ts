import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
    development: {
        client: process.env.DB_CLIENT || 'pg',
        connection: process.env.DB_CONNECTION_URL || {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'event_management',
        },
        migrations: {
            directory: path.join(__dirname, 'migrations'),
            extension: 'ts',
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        debug: false,
    },

    test: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'event_management_test',
        },
        migrations: {
            directory: path.join(__dirname, 'migrations'),
            extension: 'ts',
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
        pool: {
            min: 2,
            max: 10,
        },
    },

    production: {
        client: 'pg',
        connection: process.env.DB_CONNECTION_URL,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
            extension: 'ts',
        },
        pool: {
            min: 2,
            max: 10,
        },
        ssl: { rejectUnauthorized: false },
    },
};