import api from "./api.jsx";

export const createStripeIntent = (data) => api.post("/payments/stripe", data);

export const createPayPalOrder = (data) =>
  api.post("/payments/paypal/create", data);

export const capturePayPalOrder = (data) =>
  api.post("/payments/paypal/capture", data);

export const processEcocash = (data) => api.post("/payments/ecocash", data);
