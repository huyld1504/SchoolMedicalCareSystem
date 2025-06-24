import { callAPI } from "./axiosClient";

const roleApi = {
  getRoles: async () => {
    return await callAPI("get", "roles");
  },
};

export default roleApi;
