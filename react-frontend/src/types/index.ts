// User-related types
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

// Event-related types
export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    userId: number;
    organizer?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
}

export interface EventsResponse {
    events: Event[];
    pagination: {
        totalEvents: number;
        totalPages: number;
        currentPage: number;
        eventsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface EventFilter {
    name?: string;
    date?: string;
    page: number;
    limit: number;
}

// RSVP-related types
export type RsvpStatus = 'attending' | 'maybe' | 'declined' | null;

export interface Rsvp {
    id: number;
    userId: number;
    eventId: number;
    status: RsvpStatus;
    createdAt?: string;
    updatedAt?: string;
    user?: User;
}

export interface RsvpFormData {
    status: RsvpStatus;
}

// Theme-related types
export type ThemeMode = 'light' | 'dark';

// Error types
export interface ApiError {
    message: string;
    errors?: Array<{
        msg: string;
        param: string;
        location: string;
    }>;
}