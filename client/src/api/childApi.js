import { callAPI } from "./axiosClient";

const childAPI = {
    // Lấy danh sách con em của parent
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
};

export const childApi = childAPI;
export default childAPI;
