import { callAPI } from "./axiosClient";

const medicalOrderAPI = {
    // Lấy danh sách đơn thuốc của parent với pagination và filter
    getMyOrders: async (params = {}) => {
        const queryString = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.keyword && { keyword: params.keyword }),
            ...(params.status && { status: params.status }),
            ...(params.childId && { childId: params.childId }),
        }).toString();

        return await callAPI('GET', `/medical-orders?${queryString}`);
    },

    // Lấy danh sách đơn thuốc theo child ID
    getOrdersByChildId: async (childId, params = {}) => {
        const queryString = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.status && { status: params.status }),
        }).toString();

        return await callAPI('GET', `/medical-orders?childId=${childId}&${queryString}`);
    },

    // Lấy danh sách đơn thuốc (backward compatibility)
    getMedicalOrders: async (params = {}) => await callAPI('GET', '/medical-orders', params),

    // Lấy đơn thuốc theo child ID (backward compatibility)
    getMedicalOrdersByChild: async (childId, params = {}) => await callAPI('GET', `/medical-orders`, { ...params, childId }),

    // Tạo đơn thuốc/chỉ định y tế mới
    createMedicalOrder: async (orderData) => await callAPI('POST', '/medical-orders/add', orderData),

    // Lấy chi tiết đơn thuốc
    getMedicalOrderById: async (orderId) => await callAPI('GET', `/medical-orders/${orderId}`),

    // Cập nhật trạng thái đơn thuốc
    updateMedicalOrderStatus: async (orderId, status) => await callAPI('PUT', `/medical-orders/update-status/${orderId}`, { status }),

    // Lấy records của một medical order
    getMedicalOrderRecords: async (orderId, params = {}) => await callAPI('GET', `/medical-orders/${orderId}/records`, params),

    // Thêm medical record cho một order
    addMedicalRecord: async (orderId, recordData) => await callAPI('POST', `/medical-orders/${orderId}/add-record`, recordData),

    // Hủy đơn thuốc
    cancelMedicalOrder: async (orderId, reason) => await callAPI('PUT', `/medical-orders/${orderId}/cancel`, { reason }),
};

export const medicalOrderApi = medicalOrderAPI;
export default medicalOrderAPI;
