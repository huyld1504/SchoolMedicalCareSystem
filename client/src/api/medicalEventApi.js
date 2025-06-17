import { callAPI } from './axiosClient';

const medicalEventAPI = {
    // Tạo mới sự kiện y tế
    create: async () => await callAPI('POST', `/medical-events/create`),
    // Lấy chi tiết sự kiện y tế
    getEventById: async (childId) => await callAPI('GET', `/medical-events/student/${childId}`),
};

export default medicalEventAPI;