import api from "./api.jsx";

export const updateUser = (data) => api.put("/users/me", data);
export const uploadAvatar = (formData) => api.post("/users/avatar", formData);
export const changePassword = (data) => api.put("/users/change-password", data);
