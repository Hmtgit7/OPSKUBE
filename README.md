# EventHub - Event Management System

EventHub is a full-stack event management application that allows users to create, discover, and RSVP to events. The application includes both a RESTful backend API (with implementations in Node.js and Java) and a user-friendly web interface built with React.

🌐 **Live Demo**: [https://opskube.onrender.com/](https://opskube.onrender.com/)

## Features

- **User Authentication**: Register, login, and profile management
- **Event Management**: Create, view, edit, and delete events
- **Event Discovery**: Browse events with search and filtering options
- **RSVP System**: RSVP to events with different status options (attending, maybe, declined)
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark/Light Theme**: Automatic theme detection with toggle option

## Tech Stack

### Frontend
- **React.js**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **Context API**: State management
- **React Query**: Data fetching
- **Formik & Yup**: Form handling and validation

### Backend (Node.js)
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Sequelize**: ORM for PostgreSQL
- **JWT**: Authentication
- **PostgreSQL**: Database

### Backend (Java)
- **Spring Boot**: Web framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: ORM for PostgreSQL
- **JWT**: Authentication
- **PostgreSQL**: Database

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 17 (for Java backend)
- Docker and Docker Compose (optional)
- PostgreSQL (if not using Docker)

### Quick Start with Docker

The easiest way to run the complete application is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/Hmtgit7/EventHub.git
cd EventHub

# Start all services with Node.js backend
docker-compose --profile node up -d

# Or start all services with Java backend
docker-compose --profile java up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Node.js Backend API: http://localhost:5001/api
- Java Backend API: http://localhost:5000/api
- PostgreSQL Database: localhost:5432

### Manual Setup

#### Database Setup
1. Create a PostgreSQL database named `event_management`
2. Run the seed script to populate initial data:
   ```bash
   psql -U postgres -d event_management -f seed-data.sql
   ```

#### Node.js Backend
```bash
# Navigate to Node.js backend directory
cd node-backend

# Install dependencies
npm install

# Copy environment variables and update them
cp .env.example .env

# Build TypeScript
npm run build

# Start the server
npm start

# For development with auto-reload
npm run dev
```

#### Java Backend
```bash
# Navigate to Java backend directory
cd java-backend

# Build with Maven
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

#### React Frontend
```bash
# Navigate to React frontend directory
cd react-frontend

# Install dependencies
npm install

# Copy environment variables and update them
cp .env.example .env

# Start development server
npm run dev
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |
| GET | /api/auth/profile | Get current user profile |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all events with pagination and filters |
| GET | /api/events/:id | Get a single event by ID |
| POST | /api/events | Create a new event |
| PUT | /api/events/:id | Update an existing event |
| DELETE | /api/events/:id | Delete an event |
| GET | /api/events/my-events | Get events created by the current user |

### RSVP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/events/:id/rsvp | RSVP to an event |
| GET | /api/events/:id/rsvp | Get all RSVPs for an event |
| GET | /api/events/:id/rsvp/me | Get current user's RSVP status |
| DELETE | /api/events/:id/rsvp | Cancel RSVP |

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
VITE_API_BACKEND=node # or java
```

### Node.js Backend (.env)
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

### Java Backend (application.properties)
```
spring.application.name=event-management
server.port=5000
server.servlet.context-path=/api
spring.datasource.url=jdbc:postgresql://localhost:5432/event_management
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=your_jwt_secret_key
app.jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:5173
```

## Troubleshooting

### Common Issues

1. **Authentication Issues**:
   - Make sure the JWT_SECRET is the same across both backends
   - Check if the token is being properly set in localStorage
   - Verify that the token is being included in request headers

2. **Database Connection Issues**:
   - Check database credentials in environment variables
   - Ensure PostgreSQL service is running
   - Verify database name is correct

3. **CORS Issues**:
   - Ensure the backend CORS settings allow requests from the frontend origin
   - Check if the frontend is using the correct API URL

4. **API Request Failures**:
   - Check the browser console for detailed error messages
   - Verify API endpoints are correct
   - Ensure authentication token is valid

## Deployment

The application is deployed using the following services:

- **Frontend**: Render (Static Site)
- **Node.js Backend**: Render (Web Service)
- **Java Backend**: Render (Web Service)
- **Database**: Render (PostgreSQL)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Render](https://render.com/) for hosting