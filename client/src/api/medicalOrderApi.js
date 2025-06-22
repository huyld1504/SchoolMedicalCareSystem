import { callAPI } from './axiosClient';

const medicalOrderApi = {
    /**
     * Thêm một đơn thuốc mới.
     * Endpoint: POST /api/medical-orders/add
     * @param {object} orderData - Dữ liệu đơn thuốc, bao gồm { medicalOrder, medicalOrderDetails }.
     */
    addRecord: async (OrderId,addData) => await callAPI('POST', `/medical-orders/${OrderId}/add-record`, addData),
    updateStatus: async (orderId, status) => await callAPI('PUT', `/medical-orders/update-status/${orderId}`, { status }),
    getRecord: async (orderId) => await callAPI('GET', `/medical-orders/${orderId}/records`),
    additionalDetail : async (orderId, additionalData) => await callAPI('PUT', `/medical-orders/${orderId}/additional-details`, additionalData),


    /**
     * Lấy chi tiết một đơn thuốc bằng ID của nó.
     * (Giả định endpoint: GET /api/medical-orders/:orderId)
     * @param {string} orderId - ID của đơn thuốc cần lấy.
     */
    
  getMedicalOrder: async (query) => {
    const params = new URLSearchParams(query);
    const queryString = params.toString();
    return await callAPI('GET', `/medical-orders?${queryString}`);
},

    /**
     * Lấy danh sách đơn thuốc của một học sinh (có phân trang).
     * (Giả định endpoint: GET /api/medical-orders/child/:childId)
     * @param {string} childId - ID của học sinh.
     * @param {object} query - Các tham số truy vấn, ví dụ: { page: 1, limit: 10 }.
     */
    getDetail: async (OrderId) => 
        await callAPI('GET', `/medical-orders/${OrderId}`),

    /**
     * Cập nhật thông tin một đơn thuốc.
     * (Giả định endpoint: PUT /api/medical-orders/update/:orderId)
     * @param {string} orderId - ID của đơn thuốc cần cập nhật.
     */
    
   
};

export default medicalOrderApi;

