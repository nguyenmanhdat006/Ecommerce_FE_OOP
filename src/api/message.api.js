// src/api/message.api.js
import axiosClient from "./axiosClient";

export const messageAPI = {
  // Get list of users who have chatted with admin
  getChatUsers: () => axiosClient.get("/api/messages/users"),
  
  // Get chat history between admin and a specific user
  getChatHistory: (userId) => axiosClient.get(`/api/messages/history/${userId}`),
  
  // Get unread message count
  getUnreadCount: () => axiosClient.get("/api/messages/unread-count"),
  
  // Mark messages as read
  markAsRead: (senderId) => axiosClient.put(`/api/messages/mark-read/${senderId}`),
  
  // Get all users (for admin to initiate chat)
  getAllUsers: () => axiosClient.get("/api/user/all"),
};

