import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { messageAPI } from "@/api/message.api";
import { getUserId } from "@/utils/auth";

// Initial state
const initialState = {
  users: [],
  selectedUser: null,
  messages: [],
  messageText: "",
  connectionStatus: "disconnected",
  unreadCounts: {},
  loading: false,
  error: null,
  viewMode: "all",
  searchQuery: "",
};

// Async thunks
export const loadChatUsers = createAsyncThunk(
  "adminChat/loadChatUsers",
  async (viewMode, { rejectWithValue }) => {
    try {
      const response =
        viewMode === "all"
          ? await messageAPI.getAllUsers()
          : await messageAPI.getChatUsers();

      const users = Array.isArray(response) ? response : response?.data || [];

      const unreadResp = await messageAPI.getUnreadCount().catch(() => ({}));
      const unreadData = (unreadResp?.data || unreadResp) || {};

      return { users, unreadCounts: unreadData };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || "Failed to load users");
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  "adminChat/loadChatHistory",
  async (user, { rejectWithValue }) => {
    try {
      const userId = getUserId(user);
      const response = await messageAPI.getChatHistory(userId);
      const msgs = Array.isArray(response) ? response : response?.data || [];
      await messageAPI.markAsRead(userId);
      return { user, messages: msgs, userId };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || "Failed to load chat history");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "adminChat/markAsRead",
  async (senderId, { rejectWithValue }) => {
    try {
      await messageAPI.markAsRead(senderId);
      return senderId;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || "Failed to mark as read");
    }
  }
);

// Slice
const adminChatSlice = createSlice({
  name: "adminChat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessageText: (state, action) => {
      state.messageText = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      const senderId = action.payload.senderId;
      const selId = getUserId(state.selectedUser);
      if (selId !== senderId) {
        state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
      }
    },
    updateUserLastMessage: (state, action) => {
      const { userId, content, createdAt } = action.payload;
      state.users = state.users.map(u =>
        getUserId(u) === userId ? { ...u, lastMessage: content, lastMessageTime: createdAt } : u
      );
    },
    removeUnread: (state, action) => {
      const userId = action.payload;
      delete state.unreadCounts[userId];
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
        state.users = action.payload.users;
        state.unreadCounts = action.payload.unreadCounts;
      })
      .addCase(loadChatUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(loadChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
        state.messages = action.payload.messages;
        delete state.unreadCounts[action.payload.userId];
      })
      .addCase(loadChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        delete state.unreadCounts[action.payload];
      })
  },
});

export const {
  setSelectedUser,
  setMessageText,
  setViewMode,
  setSearchQuery,
  setConnectionStatus,
  addMessage,
  updateUserLastMessage,
  removeUnread,
} = adminChatSlice.actions;

export default adminChatSlice.reducer;
