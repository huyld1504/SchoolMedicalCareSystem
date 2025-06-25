import { callAPI } from './axiosClient';

const vaccinationApi = {
  // Vaccination Campaign APIs
  campaigns: {
    // Lấy tất cả chiến dịch
    getAll: async (params = {}) => {
      return await callAPI('GET', '/vaccination-campaigns/all', { params });
    },

    // Lấy chiến dịch theo ID
    getById: async (id) => {
      return await callAPI('GET', `/vaccination-campaigns/get/${id}`);
    },

    // Tạo chiến dịch mới (Admin only)
    create: async (data) => {
      return await callAPI('POST', '/vaccination-campaigns', data);
    },

    // Cập nhật chiến dịch (Admin only)
    update: async (id, data) => {
      return await callAPI('PUT', `/vaccination-campaigns/${id}`, data);
    },

    // Thêm học sinh vào chiến dịch (Admin only)
    addStudents: async (id, studentIds) => {
      return await callAPI('POST', `/vaccination-campaigns/${id}/students`, { studentIds });
    },

    // Lấy danh sách tham gia của chiến dịch
    getParticipations: async (id, params = {}) => {
      return await callAPI('GET', `/vaccination-campaigns/participations/${id}`, { params });
    },

    // Tìm kiếm chiến dịch
    search: async (params = {}) => {
      return await callAPI('GET', '/vaccination-campaigns/search', { params });
    }
  },

  // Vaccination Participation APIs
  participations: {
    // Phụ huynh đồng ý/từ chối
    parentConsent: async (id, data) => {
      return await callAPI('PUT', `/vaccination-participations/${id}/consent`, data);
    },

    // Y tá ghi nhận kết quả tiêm
    recordVaccination: async (id, data) => {
      return await callAPI('PUT', `/vaccination-participations/${id}/record`, data);
    },

    // Lấy danh sách tham gia của phụ huynh
    getParentParticipations: async (params = {}) => {
      return await callAPI('GET', '/vaccination-participations/parent', { params });
    },

    // Tìm kiếm tham gia (Admin/Nurse)
    search: async (params = {}) => {
      return await callAPI('GET', '/vaccination-participations/search', { params });
    },

    // Tìm kiếm tham gia của phụ huynh
    searchParent: async (params = {}) => {
      return await callAPI('GET', '/vaccination-participations/search-parent', { params });
    }
  }
};

export default vaccinationApi;
