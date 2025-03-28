# EventHub - Modern Event Management UI

This is a modern responsive React frontend for the EventHub application, a full-featured event management system. The UI is designed to work with both the Node.js and Java backends.

## Features

- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection with manual toggle option
- **Modern UI**: Built with Tailwind CSS, Material UI, and Framer Motion
- **Authentication**: Complete user registration, login, and profile management
- **Event Management**: Create, edit, view, and delete events
- **RSVP System**: RSVP to events with different status options
- **Filtering & Search**: Search and filter events by name and date
- **My Events**: View events you've created and events you're attending

## Tech Stack

- **React 18** - Frontend library
- **Vite** - Build tool and development server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material UI** - UI component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Formik & Yup** - Form handling and validation
- **React Toastify** - Toast notifications
- **JWT Decode** - JWT token handling
- **Date-fns** - Date manipulation library
- **Heroicons** - Icon library

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd react-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the environment example file and modify as needed:
   ```
   cp .env.example .env
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Open your browser and navigate to `http://localhost:3000`

## Environment Configuration

The `.env` file controls which backend the frontend communicates with:
<!-- 
```
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_BACKEND=node
``` -->

- Set `VITE_API_BACKEND` to `node` for the Node.js backend or `java` for the Java backend
- Node.js backend runs on port 5000 by default
- Java backend runs on port 5001 by default

## Building for Production

To create a production build:

```
npm run build
```

This will generate optimized files in the `dist` directory.

## Docker Deployment

A Dockerfile is included for containerized deployment:

```
docker build -t eventhub-frontend .
docker run -p 3000:80 -e BACKEND_URL=http://backend:5000 eventhub-frontend
```

## Project Structure

```
src/
├── assets/           # Static assets like images
├── components/       # Reusable UI components
│   ├── auth/         # Authentication-related components
│   ├── events/       # Event-related components
│   ├── layout/       # Layout components like Header and Footer
│   └── ui/           # Generic UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Top-level page components
├── services/         # API service functions
└── utils/            # Utility functions
```

## Backend Compatibility

This frontend is designed to work with both backends:

- **Node.js Backend**: Uses Express.js and Sequelize with PostgreSQL
- **Java Backend**: Uses Spring Boot and JPA with PostgreSQL

The frontend automatically adapts to the backend being used through service adapters and environment configuration.

## Customization

### Theming

- Colors can be customized in `tailwind.config.js`
- Component styles can be modified in `src/index.css`

### Adding New Features

1. Create new components in the appropriate directory
2. Add new API services in the services directory
3. Update or create new pages as needed
4. Add new routes to `App.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers on iOS and Android

## License

This project is licensed under the MIT License.