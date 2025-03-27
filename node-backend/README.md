# Event Management System - Node.js Backend

This is the Node.js + TypeScript backend for the Event Management System. It provides a RESTful API for managing events, user authentication, and RSVP functionality.

## Features

- User authentication with JWT
- CRUD operations for events
- RSVP to events
- Pagination, filtering, and searching
- PostgreSQL database with TypeORM
- Input validation
- Error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- JWT Authentication

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events with pagination |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/events/:id/rsvp` | RSVP to an event |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd OPSKUBE/node-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and JWT secret

5. Run database migrations
   ```bash
   npm run typeorm migration:run
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

### Production Build

```bash
npm run build
npm start
```

## Docker

### Build Docker Image

```bash
docker build -t event-management-backend .
```

### Run Docker Container

```bash
docker run -p 4000:4000 --env-file .env event-management-backend
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Events Table
- id (UUID, Primary Key)
- name (String)
- description (Text)
- date (Timestamp)
- location (String)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### RSVPs Table
- id (UUID, Primary Key)
- status (Enum: attending, not_attending, maybe)
- userId (UUID, Foreign Key)
- eventId (UUID, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Choose the "node-backend" directory
4. Set the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`
5. Add environment variables from your `.env` file
6. Deploy the service

## License

[MIT](LICENSE)