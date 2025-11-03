import axiosClient from './axiosClient';

export const orderAPI = {
  // POST /api/orders
  create: (data) => axiosClient.post('/api/orders', data),
  getById: (id) => axiosClient.get(`/api/orders/${id}`),
  getAll: () => axiosClient.get('/api/orders')
};
