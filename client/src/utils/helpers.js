/**
 * Helper utilities for formatting and displaying data
 */

/**
 * Formats a timestamp into a human-readable date/time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date and time
 */
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Gets a relative time string (e.g., "2 hours ago", "just now")
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);

    if (secondsAgo < 60) {
        return 'just now';
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
        return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
    }

    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago`;
};

/**
 * Returns CSS classes for activity type label
 * @param {string} type - The activity type (login, update, create, delete, etc.)
 * @returns {string} CSS classes for the activity type
 */
export const getActivityTypeColor = (type) => {
    const typeMap = {
        login: 'bg-green-100 text-green-800',
        logout: 'bg-gray-100 text-gray-800',
        create: 'bg-blue-100 text-blue-800',
        update: 'bg-yellow-100 text-yellow-800',
        delete: 'bg-red-100 text-red-800',
        error: 'bg-red-100 text-red-800',
        view: 'bg-indigo-100 text-indigo-800',
        approve: 'bg-emerald-100 text-emerald-800',
        reject: 'bg-orange-100 text-orange-800',
        submit: 'bg-teal-100 text-teal-800',
        export: 'bg-purple-100 text-purple-800',
        upload: 'bg-blue-100 text-blue-800',
        download: 'bg-blue-100 text-blue-800',
    };

    return typeMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Format a number as a percentage
 * @param {number} value - The value to format
 * @param {number} [decimalPlaces=0] - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimalPlaces = 0) => {
    return `${(value * 100).toFixed(decimalPlaces)}%`;
};

/**
 * Truncate text with ellipsis if it exceeds a certain length
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=50] - Maximum length before truncating
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
