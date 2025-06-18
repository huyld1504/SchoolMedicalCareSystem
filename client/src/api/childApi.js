import { callAPI } from "./axiosClient";

const childAPI = {
    // Lấy danh sách tất cả con em của parent với pagination
    getAllChildren: async (params = {}) => {
        const queryString = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.keyword && { keyword: params.keyword }),
            ...(params.gender && { gender: params.gender }),
        }).toString();

        return await callAPI('GET', `/childs/all?${queryString}`);
    },

    // Lấy danh sách con em của parent (backward compatibility)
    getChildren: async () => await callAPI('GET', '/childs/all'),

    getMyChildren: async () => await callAPI('GET', '/childs/all'),

    // Thêm con em mới
    addChild: async (childData) => await callAPI('POST', '/childs/add', childData),

    // Lấy thông tin chi tiết một đứa trẻ
    getChildById: async (childId) => await callAPI('GET', `/childs/get/${childId}`),

    // Lấy hồ sơ sức khỏe của trẻ
    getHealthProfile: async (childId) => await callAPI('GET', `/health-profiles/child/${childId}`),

    // Cập nhật thông tin con em
    updateChild: async (childId, childData) => await callAPI('PUT', `/childs/update/${childId}`, childData),

    // Xóa con em (soft delete)
    deleteChild: async (childId) => await callAPI('DELETE', `/childs/delete/${childId}`),
};

export const childApi = childAPI;
export default childAPI;
