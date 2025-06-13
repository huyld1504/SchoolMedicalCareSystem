import axiosClient from './axiosClient';

const childAPI = {
    // Lấy danh sách con em của parent
    getChildren: (params = {}) =>
        axiosClient.callAPI('GET', '/childs/all', params),

    getMyChildren: (params = {}) =>
        axiosClient.callAPI('GET', '/childs/all', params),

    // Thêm con em mới
    addChild: (childData) =>
        axiosClient.callAPI('POST', '/childs/add', childData),

    // Lấy thông tin chi tiết một đứa trẻ
    getChildById: (childId) =>
        axiosClient.callAPI('GET', `/childs/get/${childId}`),

    // Lấy hồ sơ sức khỏe của trẻ
    getHealthProfile: (childId) =>
        axiosClient.callAPI('GET', `/health-profiles/child/${childId}`),

    // Cập nhật thông tin con em
    updateChild: (childId, childData) =>
        axiosClient.callAPI('PUT', `/childs/update/${childId}`, childData),
};

export const childApi = childAPI;
export default childAPI;
