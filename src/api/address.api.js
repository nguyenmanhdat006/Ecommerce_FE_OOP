import axiosClient from "./axiosClient";

export const addressAPI = {
  // GET /api/addresses/my-addresses - Get addresses of authenticated user
  getMyAddresses: () =>
    axiosClient.get("/api/addresses/my-addresses"),

  // GET /api/addresses - Get all addresses
  getAll: (params) =>
    axiosClient.get("/api/addresses", { params }),

  // GET /api/addresses/{id} - Get address by id
  getById: (id) =>
    axiosClient.get(`/api/addresses/${id}`),

  // POST /api/addresses - Create address
  create: (data) =>
    axiosClient.post("/api/addresses", data),

  // PUT /api/addresses/{id} - Update address
  update: (id, data) =>
    axiosClient.put(`/api/addresses/${id}`, data),

  // DELETE /api/addresses/{id} - Delete address
  delete: (id) =>
    axiosClient.delete(`/api/addresses/${id}`),
};

