import { callAPI } from './axiosClient';
import { sampleStudents, sampleStats } from '../data/sampleData';

// Students API endpoints
const studentsApi = {
    // Lấy danh sách tất cả học sinh (cho nurse)
    getAllStudents: async (params) => {
        return await callAPI("get", "/childs/all", params)
    }
};

export default studentsApi;
