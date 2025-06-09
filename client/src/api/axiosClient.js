import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

// Create axios instance with base configuration
const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management functions
const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const setAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
};

const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Request Interceptor - Add auth token to requests
axiosClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle token refresh and errors
axiosClient.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    // Attempt to refresh the token
                    const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Update stored tokens
                    setAccessToken(accessToken);
                    if (newRefreshToken) {
                        setRefreshToken(newRefreshToken);
                    }

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// Export both the client and token management functions
export default axiosClient;

export {
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    clearTokens,
};