// src/api/user.api.js
import axiosClient from "./axiosClient";

export const userAPI = {
  getProfile: () => axiosClient.get("/api/user/profile"),
};