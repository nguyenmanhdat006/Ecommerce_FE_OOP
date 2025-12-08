import axiosClient from "./axiosClient";

export const orderAPI = {
  // POST 
  create: (data) => axiosClient.post("/api/orders", data),

  // GET
  getById: (id) => axiosClient.get(`/api/orders/${id}`),
  getAll: () => axiosClient.get("/api/orders"),

  // GET orders for current logged-in user (requires Authorization header)
  getMine: () => axiosClient.get("/api/orders/me"),

  // Get list of order items (or order items) that are completed but not yet reviewed by the user
  getUnreviewed: () => axiosClient.get("/api/orders/unreviewed"),

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
  // PUT - cập nhật đơn hàng
  update: (orderId, data) => axiosClient.put(`/api/orders/${orderId}`, data),
};
