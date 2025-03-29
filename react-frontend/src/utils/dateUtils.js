// src/utils/dateUtils.js
import { format, formatDistanceToNow, isPast, isFuture, parseISO } from 'date-fns';

/**
 * Format a date to a standard display format
 * @param {string|Date} date - The date to format
 * @param {string} formatString - The format string (optional)
 * @returns {string} - The formatted date
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return String(date);
    }
};

/**
 * Format a date and time
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date and time
 */
export const formatDateTime = (date) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, 'MMM dd, yyyy h:mm a');
    } catch (error) {
        console.error('Error formatting date and time:', error);
        return String(date);
    }
};

/**
 * Format a date as a relative time from now
 * @param {string|Date} date - The date to format
 * @returns {string} - The relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return String(date);
    }
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} - True if the date is in the past
 */
export const isDatePast = (date) => {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isPast(dateObj);
    } catch (error) {
        console.error('Error checking if date is past:', error);
        return false;
    }
};

/**
 * Check if a date is in the future
 * @param {string|Date} date - The date to check
 * @returns {boolean} - True if the date is in the future
 */
export const isDateFuture = (date) => {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isFuture(dateObj);
    } catch (error) {
        console.error('Error checking if date is future:', error);
        return false;
    }
};

/**
 * Format a date for an HTML datetime-local input
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date (YYYY-MM-DDThh:mm)
 */
export const formatDateForInput = (date) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
        console.error('Error formatting date for input:', error);
        return '';
    }
};