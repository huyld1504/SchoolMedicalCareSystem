import axios from 'axios';

const baseURL = 'http://127.0.0.1:3000/api';

// Create axios instance with base configuration
const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management functions
const getAccessToken = () => {
    return localStorage.getItem('token');
};

const setAccessToken = (token) => {
    localStorage.setItem('token', token);
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
};

const clearTokens = () => {
    localStorage.removeItem('token');
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
        if (response && response.data) return response.data;
        return response;
    },
    async (error) => {
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

const callAPI = async (method, endpoint, params) => {
    try {
        const response = await axiosClient({
            method: method,
            url: endpoint,
            data: params,
        });
        return response;
    } catch (err) {
        console.error(`API Error [${method}] ${endpoint}:`, err.response?.data || err.message);
        throw err;
    }
};


const callAPIFormData = async (method, endpoint, formData) => {
    try {
        const response = await axios({
            method: method,
            url: baseURL + endpoint,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getAccessToken()}`
            },
        });
        if (response && response.data) return response.data;
        return response;
    } catch (err) {
        console.error(`FormData API Error [${method}] ${endpoint}:`, err.response?.data || err.message);
        throw err.response?.data || err;
    }
};

// Export both the client and token management functions
export {
    callAPI,
    callAPIFormData
};

export default axiosClient;

export {
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    clearTokens,
};