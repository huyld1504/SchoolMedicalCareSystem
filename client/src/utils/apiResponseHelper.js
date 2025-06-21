/**
 * Utility functions to handle API response formats consistently
 */

/**
 * Extract array data from various API response formats
 * @param {any} response - API response
 * @param {string} dataKey - Optional key where array data might be stored (e.g., 'records', 'children', 'orders')
 * @returns {Array} - Always returns an array
 */
export const extractArrayFromResponse = (response, dataKey = null) => {
    // Handle null/undefined response
    if (!response) {
        return [];
    }

    // If response is already an array
    if (Array.isArray(response)) {
        return response;
    }

    // If specific data key is provided, try to extract from it
    if (dataKey && response[dataKey]) {
        return Array.isArray(response[dataKey]) ? response[dataKey] : [];
    }

    // Try common response formats
    if (response.data) {
        // Paginated response: { data: { records: [...], total: X } }
        if (response.data.records && Array.isArray(response.data.records)) {
            return response.data.records;
        }
        // Direct data array: { data: [...] }
        if (Array.isArray(response.data)) {
            return response.data;
        }
    }

    // Try other common keys
    const commonKeys = ['records', 'items', 'list', 'results', 'children', 'orders', 'users'];
    for (const key of commonKeys) {
        if (response[key] && Array.isArray(response[key])) {
            return response[key];
        }
    }

    // Return empty array as fallback
    return [];
};

/**
 * Extract pagination info from API response
 * @param {any} response - API response
 * @param {Object} defaultPagination - Default pagination values
 * @returns {Object} - Pagination info
 */
export const extractPaginationFromResponse = (response, defaultPagination = {}) => {
    const defaults = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        ...defaultPagination
    };

    if (!response) {
        return defaults;
    }

    // If response has pagination data
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        return {
            total: response.data.total || defaults.total,
            page: response.data.page || defaults.page,
            limit: response.data.limit || defaults.limit,
            totalPages: response.data.totalPages || defaults.totalPages
        };
    }

    // If response is direct array, calculate pagination
    if (Array.isArray(response)) {
        return {
            ...defaults,
            total: response.length,
            totalPages: Math.ceil(response.length / defaults.limit)
        };
    }

    // Check for pagination at root level
    if (response.total !== undefined || response.page !== undefined) {
        return {
            total: response.total || defaults.total,
            page: response.page || defaults.page,
            limit: response.limit || defaults.limit,
            totalPages: response.totalPages || defaults.totalPages
        };
    }

    return defaults;
};

/**
 * Safe array operation wrapper
 * @param {any} data - Data that should be an array
 * @param {Function} operation - Operation to perform on array (e.g., slice, map, filter)
 * @param {Array} fallback - Fallback value if data is not array
 * @returns {any} - Result of operation or fallback
 */
export const safeArrayOperation = (data, operation, fallback = []) => {
    if (Array.isArray(data)) {
        try {
            return operation(data);
        } catch (error) {
            console.error('Error in array operation:', error);
            return fallback;
        }
    }
    return fallback;
};

/**
 * Safe slice operation for arrays
 * @param {any} data - Data that should be an array
 * @param {number} start - Start index
 * @param {number} end - End index
 * @returns {Array} - Sliced array or empty array
 */
export const safeSlice = (data, start = 0, end = undefined) => {
    return safeArrayOperation(data, (arr) => arr.slice(start, end), []);
};

/**
 * Safe map operation for arrays
 * @param {any} data - Data that should be an array
 * @param {Function} callback - Map callback function
 * @returns {Array} - Mapped array or empty array
 */
export const safeMap = (data, callback) => {
    return safeArrayOperation(data, (arr) => arr.map(callback), []);
};

/**
 * Safe filter operation for arrays
 * @param {any} data - Data that should be an array
 * @param {Function} callback - Filter callback function  
 * @returns {Array} - Filtered array or empty array
 */
export const safeFilter = (data, callback) => {
    return safeArrayOperation(data, (arr) => arr.filter(callback), []);
};
