import { callAPI } from "./axiosClient";

const vaccinationCampaignApi = {
  getAllCampaigns: async (params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `vaccination-campaigns/all${query}`);
  },

  getCampaignById: async (id) => {
    return await callAPI("get", `vaccination-campaigns/get/${id}`);
  },
  updateCampaign: async (id, data) => {
    return await callAPI("put", `vaccination-campaigns/update/${id}`, data);
  }, GetAllParticipationsInCampaign: async (campaignId, params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `vaccination-campaigns/participations/${campaignId}${query}`);
  }, SearchParticipationsForAdminAndNurse: async (params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `vaccination-participations/search${query}`);
  },

  SearchCamPaigns: async (params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `vaccination-campaigns/search${query}`);
  },

};

export default vaccinationCampaignApi;
