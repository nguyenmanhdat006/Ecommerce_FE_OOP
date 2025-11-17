// src/redux/chat/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadChatUsers, loadChatHistory } from "./thunks";
import { getUserId } from "@/utils/auth";

const chatUsersSlice = createSlice({
  name: "chatUsers",
  initialState: {
    allUsers: [],      // Tất cả users
    recentUsers: [],   // Users đã chat
    unread: {},
    viewMode: "all",
    search: "",
    loading: false,
    loaded: false,     // Flag để tránh load lại
    error: null,
  },
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    updateLastMessage: (state, action) => {
      const { userId, content, createdAt } = action.payload;
      // Update cả 2 lists
      state.allUsers = state.allUsers.map((u) =>
        getUserId(u) === userId
          ? { ...u, lastMessage: content, lastMessageTime: createdAt }
          : u
      );
      state.recentUsers = state.recentUsers.map((u) =>
        getUserId(u) === userId
          ? { ...u, lastMessage: content, lastMessageTime: createdAt }
          : u
      );
      
      // Nếu user chưa có trong recentUsers, thêm vào
      const existsInRecent = state.recentUsers.some(u => getUserId(u) === userId);
      if (!existsInRecent) {
        const userToAdd = state.allUsers.find(u => getUserId(u) === userId);
        if (userToAdd) {
          state.recentUsers.unshift({
            ...userToAdd,
            lastMessage: content,
            lastMessageTime: createdAt
          });
        }
      }
    },
    clearUnread: (state, action) => {
      const id = action.payload;
      delete state.unread[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChatUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.allUsers = action.payload.allUsers;
        state.recentUsers = action.payload.recentUsers;
        state.unread = action.payload.unread;
      })
      .addCase(loadChatUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Khi load chat history → unread user đó phải xoá
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        delete state.unread[action.payload.userId];
      });
  },
});

export const { setViewMode, setSearch, updateLastMessage, clearUnread } =
  chatUsersSlice.actions;
export default chatUsersSlice.reducer;
