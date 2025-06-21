import { callAPI } from './axiosClient';

const healthProfileAPI = {
    // Tạo hồ sơ sức khỏe mới
    create: async (profileData) => await callAPI('POST', '/health-profiles/add', profileData),

    // Lấy hồ sơ sức khỏe của con em
    getByChildId: async (childId, query = {}) => {
        const params = new URLSearchParams({
            page: query.page || 1,
            limit: query.limit || 10,
            ...(query.keyword && { keyword: query.keyword }),
        }).toString();

        return await callAPI('GET', `/health-profiles/child/${childId}?${params}`);
    },

    // Lấy tất cả hồ sơ sức khỏe của parent  
    getMyChildrenProfiles: async (query = {}) => {
        const params = new URLSearchParams({
            page: query.page || 1,
            limit: query.limit || 10,
            ...(query.keyword && { keyword: query.keyword }),
        }).toString();

        return await callAPI('GET', `/health-profiles/search?${params}`);
    },

    // Lấy hồ sơ sức khỏe theo ID
    getById: async (profileId) => await callAPI('GET', `/health-profiles/get/${profileId}`),

    // Cập nhật hồ sơ sức khỏe
    updateHealthProfile: async (profileId, profileData) => await callAPI('PUT', `/health-profiles/update/${profileId}`, profileData),
};

export default healthProfileAPI;