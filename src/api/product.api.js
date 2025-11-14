import axiosClient from "./axiosClient";

export const productAPI = {
  getAll: (params) => 
    axiosClient.get("api/products", { params }),

  getById: (id) => 
    axiosClient.get(`api/products/${id}`),

  create: (data) => 
    axiosClient.post("api/products", data),

  update: (id, data) => 
    axiosClient.put(`api/products/${id}`, data),

  search: (params) => 
    axiosClient.get("api/products/search", { params }),
};
