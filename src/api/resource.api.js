import axiosClient from "./axiosClient";

export const resourceAPI = {
  getAll: (productId) =>
    axiosClient.get(`/api/products/${productId}/resources`),

  upload: (productId, formData) =>
    axiosClient.post(`/api/products/${productId}/resources`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  setPrimary: (productId, resourceId) =>
    axiosClient.put(
      `/api/products/${productId}/resources/${resourceId}/primary`
    ),

  delete: (productId, resourceId) =>
    axiosClient.delete(
      `/api/products/${productId}/resources/${resourceId}`
    ),
};
