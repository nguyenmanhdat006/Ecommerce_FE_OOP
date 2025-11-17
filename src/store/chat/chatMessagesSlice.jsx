// src/redux/chat/messagesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadChatHistory, markAsRead } from "./thunks";
import { getUserId } from "@/utils/auth";

  const chatMessagesSlice = createSlice({
  name: "chatMessages",
  initialState: {
    selectedUser: null,
    messages: [],
    messageText: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessageText: (state, action) => {
      state.messageText = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
        state.messages = action.payload.messages;
      })
      .addCase(loadChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        // mark read trong local state nếu cần
      });
  },
});

export const { setSelectedUser, setMessageText, addMessage } =
  chatMessagesSlice.actions;

export default chatMessagesSlice.reducer;
