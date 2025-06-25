import { callAPI } from "./axiosClient";

const vaccinationApi = {
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
  },
  getVaccinationPartticipations: async (id) => {
    return await callAPI("get", `vaccination-campaigns/participations/${id}`);
  },
};

export default vaccinationApi;
