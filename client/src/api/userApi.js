import { callAPI } from "./axiosClient";

const userApi = {
  getUsers: async (params = {}) => {
    let query = "";
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params).toString();
      query = `?${searchParams}`;
    }
    return await callAPI("get", `users${query}`);
  },
  createUser: async (data) => {
    return await callAPI("post", "users/add", data);
  },
};

export default userApi;
