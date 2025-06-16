import { callAPI } from './axiosClient';
import { sampleStudents, sampleStats } from '../data/sampleData';

// Students API endpoints
const studentsApi = {
    // Lấy danh sách tất cả học sinh (cho nurse)
    getAllStudents: async (query) => {
        return await callAPI("get", `/childs/all?page=${query.page ? query.page : 1}&keyword=${query.keyword ? query.keyword : ''}&gender=${query.gender ? query.gender : ""}`);
    },

    // Lấy thông tin chi tiết một học sinh theo ID  
    getStudentById: async (studentId) => {
        return await callAPI("get", `/childs/${studentId}`)
    }
};

export default studentsApi;
