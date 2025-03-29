# EventHub - React Frontend

This is the React frontend for the EventHub application, providing a modern and responsive UI for managing events.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Authentication**: Complete user registration, login, and profile management
- **Event Management**: Create, edit, view, and delete events
- **RSVP System**: RSVP to events with different status options
- **Filtering & Search**: Search and filter events by name and date

## Tech Stack

- **React 18**: Frontend library
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Axios**: HTTP client
- **Formik & Yup**: Form handling and validation
- **React Toastify**: Toast notifications
- **JWT Decode**: JWT token handling
- **Date-fns**: Date manipulation library

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```
   cd react-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file:
   ``` REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_API_BACKEND=node
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_BASE_URL | Backend API URL | http://localhost:5001/api |
| REACT_APP_API_BACKEND | Backend type (node or java) | node |

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── auth/         # Authentication-related components
│   ├── events/       # Event-related components
│   ├── layout/       # Layout components
│   └── ui/           # Generic UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Top-level page components
├── services/         # API service functions
└── utils/            # Utility functions
```

## Backend Compatibility

This frontend works with both backend implementations:

- **Node.js Backend**: Express.js and Sequelize with PostgreSQL
- **Java Backend**: Spring Boot and JPA with PostgreSQL

The frontend automatically adapts to the backend being used through the `REACT_APP_API_BACKEND` environment variable.

## Customization

### Theming

- Colors can be customized in `tailwind.config.js`
- Component styles can be modified in `src/index.css`

## Troubleshooting

### Common Issues

1. **API Connection Problems**:
   - Check if the backend server is running
   - Verify that the `REACT_APP_API_BASE_URL` points to the correct backend

2. **Authentication Issues**:
   - Check browser console for token-related errors
   - Clear localStorage and try logging in again

3. **CORS Errors**:
   - Ensure the backend has CORS enabled for your frontend URL

4. **Build Errors**:
   - Check Node.js version (16+ required)
   - Delete `node_modules` and reinstall dependencies