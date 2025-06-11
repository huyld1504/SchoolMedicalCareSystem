import { Axios } from "axios";
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
    verifyToken: () => {
        return axiosClient.post('/auth/verify-token');
    }
};

export default authApi;