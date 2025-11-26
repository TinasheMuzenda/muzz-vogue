import api from "./api.jsx";

export const createOrder = (data) => api.post("/orders/create", data);

export const getOrders = () => api.get("/orders");

export const getOrderById = (id) => api.get(`/orders/${id}`);
