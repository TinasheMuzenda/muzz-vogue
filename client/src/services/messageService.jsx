import api from "./api.jsx";

export const sendMessage = (data) => api.post("/messages/send", data);

export const getAdminMessages = () => api.get("/messages/admin");
