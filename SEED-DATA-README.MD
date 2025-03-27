# Seed Data for Event Management System

This document explains how to use the provided seed data to populate your database with test data. We provide multiple methods to seed the database depending on your backend choice.

## Common Test Users

The seed data includes 5 test users with the following credentials:

| Username | Email | Password |
|----------|-------|----------|
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |
| bob_johnson | bob@example.com | password123 |
| alice_green | alice@example.com | password123 |
| mike_brown | mike@example.com | password123 |

## Seeding Methods

### Option 1: SQL Script (Works for both backends)

1. Start your PostgreSQL database server
2. Use a PostgreSQL client (e.g., pgAdmin, psql) to connect to your database
3. Run the `seed-data.sql` script:

```bash
# Using psql command line
psql -U postgres -d event_management -f seed-data.sql

# Or copy-paste the contents into your SQL client of choice
```

### Option 2: Node.js Backend Script

1. Navigate to the node-backend directory
2. Run the CommonJS seed script (compatible with both ES modules and CommonJS):

```bash
cd OPSKUBE/node-backend
node src/scripts/seed-commonjs.js
```

If you're using TypeScript with ts-node, you can run:
```bash
cd OPSKUBE/node-backend
npx ts-node src/scripts/seed-commonjs.js
```

### Option 3: Java Backend Automatic Seeding

For the Java backend, the seed data is automatically loaded when running the application in development mode:

1. Ensure your `application.properties` has `spring.profiles.active=dev`
2. Start the Java application, and it will automatically seed the database

## Data Overview

The seed data includes:

- 5 users with different roles and interests
- 10 events of various types (conferences, workshops, social gatherings)
- 20 RSVPs with different statuses (attending, maybe, declined)

## Using the Seed Data

After seeding the database, you can:

1. Use any of the test user credentials to log in to the application
2. View, create, edit, and delete events
3. RSVP to events and update your RSVP status

This data is perfect for testing the application's functionality and user workflows.

## Notes

- The seed data includes future events (2025) to ensure they don't appear as past events
- If you're using the seed data in production, remember to update the password for security purposes
- The SQL script will reset all data in the tables before inserting new data