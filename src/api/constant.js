//Quản lý endpoint tập trung
export const API_URLS = {
  GET_PRODUCTS: "/api/products",
  GET_PRODUCT: (id) => `/api/product/${id}`,
  GET_CATEGORIES: "/api/category",
  GET_CATEGORY: (id) => `/api/category/${id}`,
};

export const API_BASE_URL = import.meta.env.VITE_API_URL;
