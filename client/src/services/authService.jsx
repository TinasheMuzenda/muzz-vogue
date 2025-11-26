import api from "./api.jsx";

export const registerUser = async (data) => api.post("/auth/register", data);

export const loginUser = async (data) => api.post("/auth/login", data);

export const checkUsername = async (username) =>
  api.get(`/auth/check-username/${username}`);

export const uploadAvatar = async (base64) =>
  api.post("/auth/upload-avatar", { image: base64 });

export const getCurrentUser = async () => api.get("/auth/me");

export const logoutUser = () => {
  localStorage.removeItem("jwt_token");
};
