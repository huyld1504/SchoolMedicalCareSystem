import axiosClient from './axiosClient';
import { sampleStudents, sampleStats } from '../data/sampleData';

// Students API endpoints
const studentsApi = {
    // Lấy danh sách tất cả học sinh (cho nurse)
    getAllStudents: async () => {
        try {
            const response = await axiosClient.get('/childs/all');
            return response;
        } catch (error) {
            console.log(error)
        }
    },

    // Tìm kiếm học sinh
    searchStudents: (searchTerm, params = {}) => {
        return studentsApi.getAllStudents({
            search: searchTerm,
            ...params
        });
    },

    // Lấy thông tin chi tiết một học sinh
    getStudentById: async (studentId) => {
        try {
            const response = await axiosClient.get(`/childs/get/${studentId}`);
            return response;
        } catch (error) {
            console.warn('API call failed, using sample data:', error.message);
            const student = sampleStudents.find(s => s._id === studentId);
            return {
                data: {
                    isSuccess: true,
                    data: student || null
                }
            };
        }
    },

    // Lấy hồ sơ y tế của học sinh
    getStudentHealthProfile: async (studentId, params = {}) => {
        try {
            const response = await axiosClient.get(`/health-profiles/child/${studentId}`, { params });
            return response;
        } catch (error) {
            console.warn('API call failed, using sample data:', error.message);
            const student = sampleStudents.find(s => s._id === studentId);
            return {
                data: {
                    isSuccess: true,
                    data: student?.healthProfile || null
                }
            };
        }
    },

    // Tạo hồ sơ y tế mới
    createHealthProfile: (profileData) => {
        return axiosClient.post('/health-profiles/add', profileData);
    },

    // Cập nhật hồ sơ y tế
    updateHealthProfile: (profileId, profileData) => {
        return axiosClient.put(`/health-profiles/update/${profileId}`, profileData);
    },

    // Lấy danh sách đơn khám bệnh
    getMedicalOrders: (params = {}) => {
        return axiosClient.get('/medical-orders', { params });
    },

    // Cập nhật trạng thái đơn khám bệnh
    updateMedicalOrderStatus: (orderId, status) => {
        return axiosClient.put(`/medical-orders/update-status/${orderId}`, { status });
    },

    // Lấy thống kê
    getStats: async () => {
        try {
            // Có thể tạo API endpoint mới cho stats
            return {
                data: {
                    isSuccess: true,
                    data: sampleStats
                }
            };
        } catch (error) {
            return {
                data: {
                    isSuccess: true,
                    data: sampleStats
                }
            };
        }
    }
};

export default studentsApi;
