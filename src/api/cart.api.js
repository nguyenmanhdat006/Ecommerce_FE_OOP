import { getToken } from '@/utils/jwt-helper';

const buildUrl = (path) => `${import.meta.env.VITE_API_URL}${path}`;

const defaultHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const cartAPI = {
  // GET /api/carts - get carts for current authenticated user
  getUserCarts: async () => {
    const res = await fetch(buildUrl('/api/carts'), {
      method: 'GET',
      headers: defaultHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    return res.json();
  },

  // POST /api/carts - add item to cart
  addToCart: async (body) => {
    const res = await fetch(buildUrl('/api/carts'), {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    return res.json();
  },
};
