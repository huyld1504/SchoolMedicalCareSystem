import { callAPI } from './axiosClient';

const medicalOrderApi = {
    /**
     * Thêm một đơn thuốc mới.
     * Endpoint: POST /api/medical-orders/add
     * @param {object} orderData - Dữ liệu đơn thuốc, bao gồm { medicalOrder, medicalOrderDetails }.
     */
    add: async (orderData) => await callAPI('POST', '/medical-orders/add', orderData),

    /**
     * Lấy chi tiết một đơn thuốc bằng ID của nó.
     * (Giả định endpoint: GET /api/medical-orders/:orderId)
     * @param {string} orderId - ID của đơn thuốc cần lấy.
     */
    getMedicalOrder: async () => await callAPI('GET', `/medical-orders`),

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