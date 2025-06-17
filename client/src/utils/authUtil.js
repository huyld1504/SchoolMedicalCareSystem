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

//role utils 
export const roleUtils = {
  isAdmin: (user) => user && user.role === "admin",
  isParent: (user) => user && user.role === "parent",
  isNursery: (user) => user && user.role === "nurse",
  isAcceptedRole: (roles, user) => {
    return user && roles.includes(user.role);
  }
};

