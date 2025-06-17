import { callAPI } from "./axiosClient";

const medicalOrderAPI = {
    // Lấy danh sách đơn thuốc/chỉ định y tế
    getMedicalOrders: async (params = {}) => await callAPI('GET', '/medical-orders', params),

    // Lấy đơn thuốc theo child ID
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
};

export const medicalOrderApi = medicalOrderAPI;
export default medicalOrderAPI;
