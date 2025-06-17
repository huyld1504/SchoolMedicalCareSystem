import { callAPI } from "./axiosClient";

const authApi = {
    login: async (credentials) => {
        return await callAPI("post", 'auth/login', credentials);
    },
    refreshToken: async () => {
        return await callAPI("post", 'auth/refresh-token');
    },
    verifyToken:async () => {
        return await callAPI("post", 'auth/verify-token');
    }
};

export default authApi;