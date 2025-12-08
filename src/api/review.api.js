import axiosClient from './axiosClient';

export const reviewAPI = {
  // Create a new review for an order item
  // Expected payload: { userId, productId, orderItemId, rating, comment }
  create: (data) => axiosClient.post('/api/reviews', data),
  // Get reviews for a product
  getByProduct: (productId) => axiosClient.get(`/api/reviews/product/${productId}`),
  // Update a review by id
  update: (id, data) => axiosClient.put(`/api/reviews/${id}`, data),
  // Delete a review by id
  delete: (id) => axiosClient.delete(`/api/reviews/${id}`),
};
