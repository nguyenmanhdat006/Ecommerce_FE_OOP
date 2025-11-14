import axiosClient from "./axiosClient";

export const paymentAPI = {
  // POST /api/vnpay/create-payment -> returns payment url as text
  createVnPay: (data) => axiosClient.post("/api/vnpay/create-payment", data, { responseType: "text" }),

  // Generic payment endpoint for other payment methods
  createPaymentMethod: (method, data) => axiosClient.post(`/api/payment/${method}`, data),
};
