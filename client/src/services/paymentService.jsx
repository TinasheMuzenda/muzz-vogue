import api from "./api.jsx";

export const createPaypalOrder = (data) => api.post("/pay/paypal/create", data);

export const capturePaypalOrder = (orderId) =>
  api.post(`/pay/paypal/capture/${orderId}`);

export const createStripeIntent = (data) =>
  api.post("/pay/stripe/intent", data);

export const processEcocash = (data) => api.post("/pay/ecocash/pay", data);
