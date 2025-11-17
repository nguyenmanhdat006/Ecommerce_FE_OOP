import axiosClient from "./axiosClient";

export const inventoryAPI = {
  create: (data) => axiosClient.post("/api/inventory-movements", data),

  getAll: (params) => axiosClient.get("/api/inventory-movements", { params }),

  getMovements: (params) =>
    axiosClient.get("/api/inventory-movements", { params }),

  getById: (id) => axiosClient.get(`/api/inventory-movements/${id}`),

  update: (id, data) => axiosClient.put(`/api/inventory-movements/${id}`, data),

  delete: (id) => axiosClient.delete(`/api/inventory-movements/${id}`),
};
