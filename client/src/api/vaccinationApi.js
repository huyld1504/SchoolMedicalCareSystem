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
      return await callAPI('POST', '/vaccination-campaigns/create', data);
    },

    // Cập nhật chiến dịch (Admin only)
    update: async (id, data) => {
      return await callAPI('PUT', `/vaccination-campaigns/update/${id}`, data);
    },

    // Thêm học sinh vào chiến dịch (Admin only)
    addStudents: async (id, studentIds) => {
      return await callAPI('POST', `/vaccination-campaigns/add-students/${id}`, { studentIds });
    },    // Lấy danh sách tham gia của chiến dịch
    getParticipations: async (id, query = {}) => {
      return await callAPI('GET', `/vaccination-campaigns/participations/${id}?page=${query.page ? query.page : 1}&limit=${query.limit ? query.limit : 20}${query.consentStatus && query.consentStatus !== 'all' && query.consentStatus.trim() ? `&parentConsent=${encodeURIComponent(query.consentStatus)}` : ''}${query.vaccinationStatus && query.vaccinationStatus !== 'all' && query.vaccinationStatus.trim() ? `&vaccinationStatus=${encodeURIComponent(query.vaccinationStatus)}` : ''}${query.vaccinationDate ? `&vaccinationDate=${query.vaccinationDate}` : ''}${query.studentName && query.studentName.trim() ? `&studentName=${encodeURIComponent(query.studentName.trim())}` : ''}${query.keyword && query.keyword.trim() ? `&keyword=${encodeURIComponent(query.keyword.trim())}` : ''}`);
    },

    // Tìm kiếm chiến dịch
    search: async (query = {}) => {
      return await callAPI('GET', `/vaccination-campaigns/search?page=${query.page ? query.page : 1}&limit=${query.limit ? query.limit : 10}${query.status && query.status !== 'all' && query.status.trim() ? `&status=${encodeURIComponent(query.status)}` : ''}${query.startDateFrom ? `&startDateFrom=${query.startDateFrom}` : ''}${query.startDateTo ? `&startDateTo=${query.startDateTo}` : ''}${query.vaccineName && query.vaccineName.trim() ? `&vaccineName=${encodeURIComponent(query.vaccineName.trim())}` : ''}${query.keyword && query.keyword.trim() ? `&keyword=${encodeURIComponent(query.keyword.trim())}` : ''}`);
    },

  },

  // Vaccination Participation APIs
  participations: {
    // Phụ huynh đồng ý/từ chối
    parentConsent: async (id, data) => {
      return await callAPI('PUT', `/vaccination-participations/parent-consent/${id}`, data);
    },

    // Y tá ghi nhận kết quả tiêm
    recordVaccination: async (id, data) => {
      return await callAPI('PUT', `/vaccination-participations/record/${id}`, data);
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
