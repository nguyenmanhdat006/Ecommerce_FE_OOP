import axiosClient from "./axiosClient";

export const adminUserAPI = {
  getAll: () => axiosClient.get(`/api/admin/users`),
  create: (data) => axiosClient.post(`/api/admin/users`, data),
  delete: (id) => axiosClient.delete(`/api/admin/users/${id}`),
  update: (id, data) => axiosClient.put(`/api/admin/users/${id}`, data),
};
