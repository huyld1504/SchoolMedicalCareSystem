import { callAPI } from './axiosClient';

const medicalEventAPI = {
    // Tạo mới sự kiện y tế
    create: async (data) => await callAPI('POST', `/medical-events/create`, data),
      // Lấy danh sách sự kiện y tế theo học sinh với pagination
    getEventsByStudentId: async (studentId, params = {}) => await callAPI('GET', `/medical-events/student/${studentId}`, null, params),
      // Lấy chi tiết sự kiện y tế theo ID
    getEventById: async (eventId) => await callAPI('GET', `/medical-events/get/${eventId}`),
    
    // Cập nhật sự kiện y tế
    update: async (eventId, data) => await callAPI('PUT', `/medical-events/update/${eventId}`, data),
    
    // Xóa sự kiện y tế
    delete: async (eventId) => await callAPI('DELETE', `/medical-events/delete/${eventId}`),
    
    // Lấy danh sách tất cả sự kiện y tế với pagination
    getAll: async (params = {}) => await callAPI('GET', `/medical-events/all`, null, params),
};

export default medicalEventAPI;