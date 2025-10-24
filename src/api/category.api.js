import axiosClient from "./axiosClient";

export const categoryAPI = {
  getAll: (params) =>
    axiosClient.get("/api/category", { params }),

  getById: (id) =>
    axiosClient.get(`/api/category/${id}`),

  create: (data) =>
    axiosClient.post("/api/category", data),

  update: (id, data) =>
    axiosClient.put(`/api/category/${id}`, data),

  delete: (id) =>
    axiosClient.delete(`/api/category/${id}`),
};
