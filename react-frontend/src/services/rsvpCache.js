// Simple cache for RSVP statuses
const rsvpCache = {
    cache: {},

    // Set an RSVP status
    setStatus(eventId, status) {
        this.cache[eventId] = status;
        return status;
    },

    // Get an RSVP status
    getStatus(eventId) {
        return this.cache[eventId] || null;
    },

    // Clear cache
    clear() {
        this.cache = {};
    }
};

export default rsvpCache;