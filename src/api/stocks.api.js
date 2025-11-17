import axiosClient from "./axiosClient";

export const stockAPI = {
  create: (data) => axiosClient.post("/api/stock-movements", data),

  getAll: (params) => axiosClient.get("/api/stock-movements", { params }),

  getMovements: (params) =>
    axiosClient.get("/api/stock-movements", { params }),

  getById: (id) => axiosClient.get(`/api/stock-movements/${id}`),

  update: (id, data) => axiosClient.put(`/api/stock-movements/${id}`, data),

  delete: (id) => axiosClient.delete(`/api/stock-movements/${id}`),
};
