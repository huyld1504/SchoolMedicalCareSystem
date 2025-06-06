import axiosClient from "./axiosClient";

const authApi = {
    login: (credentials) => {
        return axiosClient.post('/auth/login', credentials);
    },
    register: (userData) => {
        return axiosClient.post('/auth/register', userData);
    },
    refreshToken: () => {
        return axiosClient.post('/auth/refresh-token');
    },
};

export default authApi;