import axiosClient from "./axiosClient";

export const orderAPI = {
  // POST /api/orders
  create: (data) => axiosClient.post("/api/orders", data),

  // GET
  getById: (id) => axiosClient.get(`/api/orders/${id}`),
  getAll: () => axiosClient.get("/api/orders"),

  // DELETE - xóa đơn hàng
  delete: (orderId) => axiosClient.delete(`/api/orders/${orderId}`),

  // PUT - cập nhật trạng thái đơn hàng
  updateStatus: (orderId, newStatus, changedBy) =>
    axiosClient.put(
      `/api/orders/${orderId}/status${
        changedBy ? `?changedBy=${encodeURIComponent(changedBy)}` : ""
      }`,
      { status: newStatus }
    ),

  // PUT - cập nhật đơn hàng
  update: (orderId, data) => axiosClient.put(`/api/orders/${orderId}`, data),
};
