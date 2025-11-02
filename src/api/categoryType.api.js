import axiosClient from "./axiosClient";

export const categoryTypeAPI = {
  getAll: (params) =>
    axiosClient.get("/api/category-types", { params }),

  getById: (id) =>
    axiosClient.get(`/api/category-types/${id}`),

  create: (data) =>
    axiosClient.post("/api/category-types", data),

  update: (id, data) =>
    axiosClient.put(`/api/category-types/${id}`, data),

  delete: (id) =>
    axiosClient.delete(`/api/category-types/${id}`),
};