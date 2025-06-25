import { callAPI } from "./axiosClient";

const vaccinationApi = {
  // Parent APIs - Lấy danh sách thông báo tiêm chủng của con em (có phân trang)
  getParentParticipations: async (query = {}) => await callAPI('GET', `/vaccination-participations/search-parent?page=${query.page ? query.page : 1}${query.parentConsent ? `&parentConsent=${query.parentConsent}` : ''}${query.vaccinationStatus ? `&vaccinationStatus=${query.vaccinationStatus}` : ''}${query.consentDateFrom ? `&consentDateFrom=${query.consentDateFrom}` : ''}${query.consentDateTo ? `&consentDateTo=${query.consentDateTo}` : ''}${query.vaccinationDateFrom ? `&vaccinationDateFrom=${query.vaccinationDateFrom}` : ''}${query.vaccinationDateTo ? `&vaccinationDateTo=${query.vaccinationDateTo}` : ''}`),

  // Parent APIs - Phụ huynh đồng ý/từ chối tiêm chủng
  updateParentConsent: async (participationId, data) => await callAPI('PUT', `/vaccination-participations/parent-consent/${participationId}`, data)
};

export default vaccinationApi;
