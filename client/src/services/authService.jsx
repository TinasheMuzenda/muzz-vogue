import api from "./api.jsx";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

export const checkUsername = (username) =>
  api.get(`/auth/check-username/${username}`);

export const googleAuth = (idToken) => api.post("/auth/google", { idToken });

export const requestReset = (data) => api.post("/auth/request-reset", data);

export const resetPassword = (data) => api.post("/auth/reset-password", data);

export const uploadAvatar = (base64) =>
  api.post("/auth/upload-avatar", { image: base64 });

export const getCurrentUser = () => api.get("/auth/me");

export const logoutUser = () => {
  localStorage.removeItem("jwt_token");
};
