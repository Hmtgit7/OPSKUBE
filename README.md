# EventHub - Event Management System

EventHub is a full-stack event management application that allows users to create, discover, and RSVP to events. The application includes both a RESTful backend API (with implementations in Node.js and Java) and a user-friendly web interface.

## Features

- User authentication (register, login, profile management)
- Create, edit, and delete events
- Search and filter events by name and date
- RSVP to events
- Responsive design for mobile and desktop
- Dark/light theme support

## Tech Stack

### Backend (Node.js)
- **Node.js** with **Express.js** and **TypeScript**
- **PostgreSQL** database
- **Sequelize ORM** for database operations
- **JWT** for authentication

### Backend (Java)
- **Spring Boot** with **Java 17**
- **Spring Data JPA** for database operations
- **Spring Security** with **JWT** for authentication
- **PostgreSQL** database
- **Maven** for build and dependency management

### Frontend
- **React.js** with **TypeScript**
- **Material-UI** and **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Context API** for state management
- **Formik** and **Yup** for form handling and validation

## Project Structure

```
OPSKUBE/
├── node-backend/       # Node.js Express backend
├── java-backend/       # Java Spring Boot backend
├── react-frontend/     # React frontend
└── docker-compose.yml  # Docker setup for development
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn
- Docker and Docker Compose (optional)

### Installation

#### Using Docker (Recommended)

1. Clone the repository
   ```
   git clone https://github.com/Hmtgit7/OPSKUBE.git
   cd OPSKUBE
   ```

2. Start the application using Docker Compose with your preferred backend
   ```
   # For Node.js backend
   docker-compose --profile node up -d
   
   # For Java backend
   docker-compose --profile java up -d
   ```

3. Access the application
   - Frontend: http://localhost:3000
   - Node.js Backend API: http://localhost:5001
   - Java Backend API: http://localhost:5000

#### Manual Setup

1. Clone the repository
   ```
   git clone https://github.com/Hmtgit7/event-management.git
   cd event-management
   ```

2. Set up the database
   ```
   # Create a PostgreSQL database named 'event_management'
   ```

3. Set up the backend (choose one)

   For Node.js backend:
   ```
   cd node-backend
   npm install
   cp .env.example .env  # Update the .env file with your database credentials
   npm run build
   npm start
   ```

   For Java backend:
   ```
   cd java-backend
   mvn clean install
   mvn spring-boot:run
   ```

4. Set up the frontend
   ```
   cd react-frontend
   npm install
   cp .env.example .env  # Update the .env file with your API URL
   npm start
   ```

5. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000 (Node.js) or http://localhost:5001 (Java)

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

### RSVP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/events/:id/rsvp | RSVP to an event |
| GET | /api/events/:id/rsvp | Get all RSVPs for an event |
| GET | /api/events/:id/rsvp/me | Get current user's RSVP status |
| DELETE | /api/events/:id/rsvp | Cancel RSVP |

## Deployment

### Deploying the Backend to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables in the Render dashboard
5. Deploy the service

### Deploying the Frontend to Netlify

1. Create a new site on Netlify
2. Connect your repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `build`
4. Add environment variables in the Netlify dashboard
5. Configure redirects for React Router by adding a `_redirects` file:
   ```
   /*    /index.html   200
   ```
6. Deploy the site

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Notes

### Backend Development

The backend is built with Node.js and Express using TypeScript. It follows a modular architecture with the following components:

- **Models**: Define the data structure and database schema using Sequelize
- **Controllers**: Handle API requests and implement business logic
- **Routes**: Define API endpoints and connect them to controllers
- **Middleware**: Implement authentication, validation, and error handling
- **Config**: Configuration for the database and other services
- **Utils**: Utility functions for JWT, error handling, etc.

### Frontend Development

The frontend is built with React and TypeScript. It follows a component-based architecture with the following structure:

- **Components**: Reusable UI components
- **Pages**: Top-level components that correspond to routes
- **Context**: Global state management using React Context API
- **Services**: API communication with the backend
- **Hooks**: Custom React hooks for reusable logic
- **Types**: TypeScript type definitions
- **Utils**: Utility functions

### Database Schema

The application uses PostgreSQL with the following schema:

- **Users**: Store user information and authentication data
- **Events**: Store event details including name, description, date, and location
- **RSVPs**: Store user RSVPs to events with status (attending, maybe, declined)

## Future Enhancements

- Event categories and tags
- Event images and media upload
- User roles and permissions
- Email notifications
- Social sharing
- Calendar integration
- Advanced search and filtering
- Event comments and discussions
- Analytics and reporting

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sequelize](https://sequelize.org/)
- [JWT](https://jwt.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)