import axiosClient from "./axiosClient";

export const orderAPI = {
  // POST 
  create: (data) => axiosClient.post("/api/orders", data),

  // GET
  getById: (id) => axiosClient.get(`/api/orders/${id}`),
  getAll: () => axiosClient.get("/api/orders"),

  // DELETE 
  delete: (orderId) => axiosClient.delete(`/api/orders/${orderId}`),

  // PUT 
  updateStatus: (orderId, newStatus, changedBy) =>
    axiosClient.patch(
      `/api/orders/${orderId}/status${
        changedBy ? `?changedBy=${encodeURIComponent(changedBy)}` : ""
      }`,
      { status: newStatus }
    ),

  update: (orderId, data) => axiosClient.put(`/api/orders/${orderId}`, data),
};
