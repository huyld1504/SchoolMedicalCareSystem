import { callAPI } from "./axiosClient";

const vaccinationApi = {
  // Parent APIs - Lấy danh sách thông báo tiêm chủng của con em (có phân trang)
  getParentParticipations: async (q = {}) => await callAPI('GET', `/vaccination-participations/search-parent?page=${q.page||1}${q.parentConsent?`&parentConsent=${q.parentConsent}`:''}${q.vaccinationStatus?`&vaccinationStatus=${q.vaccinationStatus}`:''}${q.consentDateFrom?`&consentDateFrom=${q.consentDateFrom}`:''}${q.consentDateTo?`&consentDateTo=${q.consentDateTo}`:''}${q.vaccinationDateFrom?`&vaccinationDateFrom=${q.vaccinationDateFrom}`:''}${q.vaccinationDateTo?`&vaccinationDateTo=${q.vaccinationDateTo}`:''}${q.keyword?`&keyword=${encodeURIComponent(q.keyword)}`:''}`),

  // Parent APIs - Phụ huynh đồng ý/từ chối tiêm chủng
  updateParentConsent: async (participationId, data) => await callAPI('PUT', `/vaccination-participations/parent-consent/${participationId}`, data),

  // Nurse/Admin APIs - Quản lý chiến dịch tiêm chủng
  getVaccinations: async (params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `vaccination-campaigns/search${query}`);
  },
  createVaccination: async (data) => {
    return await callAPI("post", "vaccination-campaigns/create", data);
  },
  updateVaccination: async (id, data) => {
    return await callAPI("put", `vaccination-campaigns/update/${id}`, data);
  },
  getVaccinationPartticipations: async (id) => {
    return await callAPI("get", `vaccination-campaigns/participations/${id}`);
  },
  addStudentToVaccination: async (id, data) => {
    return await callAPI(
      "post",
      `vaccination-campaigns/add-students/${id}`,
      data
    );
  }
};

export default vaccinationApi;
