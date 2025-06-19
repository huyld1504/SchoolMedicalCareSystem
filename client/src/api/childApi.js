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
    addChild: async (childData) => await callAPI('POST', '/childs/add', childData),    // Lấy thông tin chi tiết một đứa trẻ
    getChildById: async (childId) => {
        try {
            // Thử gọi API trực tiếp trước
            return await callAPI('GET', `/childs/get/${childId}`);
        } catch (error) {
            // Nếu không có API riêng, lấy từ danh sách và filter
            console.log('Fallback to get child from list');
            const response = await callAPI('GET', '/childs/all');

            if (response && response.data && response.data.records) {
                const child = response.data.records.find(c => c._id === childId);
                if (child) {
                    return {
                        ...response,
                        data: child
                    };
                }
            }

            throw new Error('Child not found');
        }
    },

    // Lấy hồ sơ sức khỏe của trẻ
    getHealthProfile: async (childId) => await callAPI('GET', `/health-profiles/child/${childId}`),

    // Cập nhật thông tin con em
    updateChild: async (childId, childData) => await callAPI('PUT', `/child/update/${childId}`, childData),

    // Xóa con em (soft delete)
    deleteChild: async (childId) => await callAPI('DELETE', `/child/delete/${childId}`),
};

export const childApi = childAPI;
export default childAPI;
