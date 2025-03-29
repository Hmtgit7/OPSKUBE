# EventHub - Node.js Backend

This is the Node.js + TypeScript backend for the EventHub application. It provides a RESTful API for managing events, user authentication, and RSVP functionality.

## Features

- User authentication with JWT
- CRUD operations for events
- RSVP to events
- Pagination, filtering, and searching
- PostgreSQL database with Sequelize ORM
- Input validation
- Error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/profile` | Get current user profile |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events with pagination |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/my-events` | Get events created by current user |

### RSVPs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/rsvp` | RSVP to an event |
| GET | `/api/events/:id/rsvp` | Get all RSVPs for an event |
| GET | `/api/events/:id/rsvp/me` | Get current user's RSVP status |
| DELETE | `/api/events/:id/rsvp` | Delete RSVP |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd node-backend
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
   npm run db:migrate
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
docker run -p 5001:5001 --env-file .env event-management-backend
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- username (String, Unique)
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
- userId (UUID, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### RSVPs Table
- id (UUID, Primary Key)
- status (Enum: attending, maybe, declined)
- userId (UUID, Foreign Key)
- eventId (UUID, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)

## Environment Variables

```
PORT=5001
NODE_ENV=development
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=event_management
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Sequelize models
├── routes/         # API routes
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application
- `npm run lint` - Lint the codebase
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Select the Node.js backend directory
4. Set the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`
5. Add environment variables from your `.env` file
6. Deploy the service

## Troubleshooting

### Common Issues

1. **Database Connection Problems**:
   - Check database credentials in `.env` file
   - Ensure PostgreSQL server is running
   - Verify database exists and user has correct permissions

2. **JWT Issues**:
   - Ensure `JWT_SECRET` is properly set
   - Check token expiration time

3. **Sequelize Errors**:
   - Run migrations to ensure database schema is up to date
   - Check model definitions match database structure

## License

[MIT](LICENSE)