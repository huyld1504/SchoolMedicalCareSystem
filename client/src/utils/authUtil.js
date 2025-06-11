import authApi from "../api/authApi";

export const authUtils = {
  isAuthenticated: async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) return false;
    const response = await authApi.verifyToken();
    if (response.isSuccess) {
      const user = {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role
      };
      return user;
    } else return false;
  }
};