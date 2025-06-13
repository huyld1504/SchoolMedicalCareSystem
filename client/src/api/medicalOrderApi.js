import axiosClient from './axiosClient';

const medicalOrderAPI = {
    // Lấy danh sách đơn thuốc/chỉ định y tế
    getMedicalOrders: (params = {}) =>
        axiosClient.callAPI('GET', '/medical-orders', params),

    // Lấy đơn thuốc theo child ID
    getMedicalOrdersByChild: (childId, params = {}) =>
        axiosClient.callAPI('GET', `/medical-orders`, { ...params, childId }),

    // Tạo đơn thuốc/chỉ định y tế mới
    createMedicalOrder: (orderData) =>
        axiosClient.callAPI('POST', '/medical-orders/add', orderData),

    // Lấy chi tiết đơn thuốc
    getMedicalOrderById: (orderId) =>
        axiosClient.callAPI('GET', `/medical-orders/${orderId}`),

    // Cập nhật trạng thái đơn thuốc
    updateMedicalOrderStatus: (orderId, status) =>
        axiosClient.callAPI('PUT', `/medical-orders/update-status/${orderId}`, { status }),

    // Lấy records của một medical order
    getMedicalOrderRecords: (orderId, params = {}) =>
        axiosClient.callAPI('GET', `/medical-orders/${orderId}/records`, params),

    // Thêm medical record cho một order
    addMedicalRecord: (orderId, recordData) =>
        axiosClient.callAPI('POST', `/medical-orders/${orderId}/add-record`, recordData),
};

export const medicalOrderApi = medicalOrderAPI;
export default medicalOrderAPI;
