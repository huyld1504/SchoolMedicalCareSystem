import { callAPI } from './axiosClient';

const healthProfileAPI = {
    // Tạo hồ sơ sức khỏe mới
    create: async (profileData) => await callAPI('POST', '/health-profiles/add', profileData),

    // Lấy hồ sơ sức khỏe của con em
    getByChildId: async (childId, query) => await callAPI('GET', `/health-profiles/child/${childId}?page=${query.page ? query.page : 1}`),

    // Lấy tất cả hồ sơ sức khỏe của parent
    getMyChildrenProfiles: async (profileId) => await callAPI('GET', `/health-profiles/get/${profileId}`),

    // Cập nhật hồ sơ sức khỏe
    updateHealthProfile: async (profileId, profileData) => await callAPI('PUT', `/health-profiles/update/${profileId}`, profileData),
};

export default healthProfileAPI;