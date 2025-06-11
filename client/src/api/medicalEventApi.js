import callAPI from './axiosClient';

const medicalEventAPI = {
    // Tạo mới sự kiện y tế
    create: () => callAPI('POST', `/medical-events/create`),

    // Lấy chi tiết sự kiện y tế
    getEventById: (childId) => callAPI('GET', `/medical-events/student/${childId}`),

};

export default medicalEventAPI;