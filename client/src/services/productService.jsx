import api from "./api.jsx";

export const getProducts = async (params = {}) =>
  api.get("/products", { params });

export const getProductById = async (id) => api.get(`/products/${id}`);

export const createProduct = async (formData) =>
  api.post("/products/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = async (id, formData) =>
  api.put(`/products/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ADMIN
export const adminAddProduct = async (formData) =>
  api.post("/admin/product/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateProduct = async (id, formData) =>
  api.put(`/admin/product/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
