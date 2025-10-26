import axios from "axios";
import { getToken, getRefresh, saveToken, clearTokens } from "@/utils/jwt-helper";
import { authAPI } from "./auth.api";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// flags tránh loop refresh
let isRefreshing = false;
let queue = [];

// ===== RESPONSE INTERCEPTOR =====
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      // tránh vô hạn loop
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = getRefresh();
        const { access_token, refresh_token } = (await authAPI.refreshToken(refresh)).data;

        // Cập nhật storage
        saveToken(access_token, refresh_token);

        // Replay requests đợi hàng
        queue.forEach((cb) => cb(access_token));
        queue = [];
        
        // Thực hiện lại req ban đầu
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return axiosClient(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/v1/login"; // auto logout
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error trả data đẹp
    return Promise.reject(
      error.response?.data || { message: "Network error", status: 500 }
    );
  }
);

export default axiosClient;
