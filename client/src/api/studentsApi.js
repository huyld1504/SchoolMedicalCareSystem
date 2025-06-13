import { callAPI } from './axiosClient';
import { sampleStudents, sampleStats } from '../data/sampleData';

// Students API endpoints
const studentsApi = {
    // Lấy danh sách tất cả học sinh (cho nurse)
    getAllStudents: async (params) => {
        return await callAPI("get", "/childs/all", params)
    },

    // Lấy thông tin chi tiết một học sinh theo ID
    getStudentById: async (studentId) => {
        return await callAPI("get", `/childs/${studentId}`)
    }
};

export default studentsApi;
