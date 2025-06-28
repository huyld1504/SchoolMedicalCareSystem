import { callAPI } from './axiosClient';

const medicalEventAPI = {
    // Tạo mới sự kiện y tế
    create: async (data) => await callAPI('POST', `/medical-events/create`, data),    // Lấy danh sách sự kiện y tế theo học sinh với pagination
    getEventsByStudentId: async (studentId, query = {}) => await callAPI('GET', `/medical-events/student/${studentId}?page=${query.page ? query.page : 1}&limit=${query.limit ? query.limit : 10}${query.level ? `&level=${query.level}` : ''}${query.status ? `&status=${encodeURIComponent(query.status)}` : ''}${query.dateFrom ? `&dateFrom=${query.dateFrom}` : ''}${query.dateTo ? `&dateTo=${query.dateTo}` : ''}${query.eventType ? `&eventType=${encodeURIComponent(query.eventType)}` : ''}${query.keyword ? `&keyword=${encodeURIComponent(query.keyword)}` : ''}`),
    // Lấy chi tiết sự kiện y tế theo ID
    getEventById: async (eventId) => await callAPI('GET', `/medical-events/get/${eventId}`),

    // Cập nhật sự kiện y tế
    update: async (eventId, data) => await callAPI('PUT', `/medical-events/update/${eventId}`, data),

    // Xóa sự kiện y tế
    delete: async (eventId) => await callAPI('DELETE', `/medical-events/delete/${eventId}`),    
    
    // Lấy danh sách tất cả sự kiện y tế với pagination
    getAll: async (query = {}) => await callAPI('GET', `/medical-events/all?page=${query.page ? query.page : 1}&limit=${query.limit ? query.limit : 10}${query.level ? `&level=${query.level}` : ''}${query.status ? `&status=${encodeURIComponent(query.status)}` : ''}${query.startDate ? `&startDate=${query.startDate}` : ''}${query.endDate ? `&endDate=${query.endDate}` : ''}${query.type ? `&type=${encodeURIComponent(query.type)}` : ''}${query.keyword ? `&keyword=${encodeURIComponent(query.keyword)}` : ''}`),
};

export default medicalEventAPI;