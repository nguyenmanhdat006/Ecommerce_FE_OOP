import axiosClient from './axiosClient';

export const orderAPI = {
  // POST /api/orders
  create: (data) => axiosClient.post('/api/orders', data),
};
