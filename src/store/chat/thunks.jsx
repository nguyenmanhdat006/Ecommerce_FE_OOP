// src/redux/chat/thunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { messageAPI } from "@/api/message.api";
import { getUserId } from "@/utils/auth";

// Load danh sách users - load cả 2 loại cùng lúc
export const loadChatUsers = createAsyncThunk(
  "chatUsers/loadChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Load cả 2 loại users song song
      const [allUsersResp, recentUsersResp, unreadResp] = await Promise.all([
        messageAPI.getAllUsers(),
        messageAPI.getChatUsers(),
        messageAPI.getUnreadCount().catch(() => ({}))
      ]);

      const allUsers = Array.isArray(allUsersResp) ? allUsersResp : allUsersResp?.data || [];
      const recentUsers = Array.isArray(recentUsersResp) ? recentUsersResp : recentUsersResp?.data || [];
      const unread = unreadResp?.data || unreadResp || {};

      return { allUsers, recentUsers, unread };
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Failed to load users");
    }
  }
);

// Load lịch sử chat
export const loadChatHistory = createAsyncThunk(
  "messages/loadChatHistory",
  async (user, { rejectWithValue }) => {
    try {
      const userId = getUserId(user);
      const res = await messageAPI.getChatHistory(userId);
      const msgs = Array.isArray(res) ? res : res?.data || [];

      // Mark read
      await messageAPI.markAsRead(userId);

      return { user, messages: msgs, userId };
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Failed to load chat history");
    }
  }
);

// Mark unread -> read
export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (senderId, { rejectWithValue }) => {
    try {
      await messageAPI.markAsRead(senderId);
      return senderId;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Failed to mark as read");
    }
  }
);
