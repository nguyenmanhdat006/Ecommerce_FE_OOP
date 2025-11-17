// src/redux/chat/index.js
import chatUsersReducer from "./chatUsersSlice";
import chatMessagesReducer from "./chatMessagesSlice";
import chatConnectionReducer from "./chatConnectionSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { getUserId } from "@/utils/auth";

// ============ Export Thunks ============
export { loadChatUsers, loadChatHistory, markAsRead } from "./thunks";

// ============ Export Actions ============
// Chat Users Actions
export {
  setViewMode,
  setSearch,
  updateLastMessage,
  clearUnread,
} from "./chatUsersSlice";

// Chat Messages Actions
export {
  setSelectedUser,
  setMessageText,
  addMessage,
} from "./chatMessagesSlice";

// Chat Connection Actions
export { setConnectionStatus } from "./chatConnectionSlice";

// ============ Combined Reducer ============
const chatSlice = combineReducers({
  users: chatUsersReducer,
  messages: chatMessagesReducer,
  connection: chatConnectionReducer,
});

export default chatSlice;

// ============ Selectors ============

// Chat Users Selectors
export const selectAllUsers = (state) => state.chat.users.allUsers;
export const selectRecentUsers = (state) => state.chat.users.recentUsers;
export const selectUnreadCounts = (state) => state.chat.users.unread;
export const selectViewMode = (state) => state.chat.users.viewMode;
export const selectSearchQuery = (state) => state.chat.users.search;
export const selectUsersLoading = (state) => state.chat.users.loading;
export const selectUsersLoaded = (state) => state.chat.users.loaded;
export const selectUsersError = (state) => state.chat.users.error;

// Selector trả về users dựa trên viewMode
export const selectChatUsers = (state) => {
  const viewMode = state.chat.users.viewMode;
  return viewMode === "all" 
    ? state.chat.users.allUsers 
    : state.chat.users.recentUsers;
};

// Chat Messages Selectors
export const selectMessages = (state) => state.chat.messages.messages;
export const selectSelectedUser = (state) => state.chat.messages.selectedUser;
export const selectMessageText = (state) => state.chat.messages.messageText;
export const selectMessagesLoading = (state) => state.chat.messages.loading;
export const selectMessagesError = (state) => state.chat.messages.error;

// Chat Connection Selectors
export const selectConnectionStatus = (state) => state.chat.connection.status;

// Derived Selectors
export const selectFilteredUsers = (state) => {
  const users = selectChatUsers(state);
  const search = state.chat.users.search;
  
  if (!search) return users;

  const q = search.toLowerCase();
  return users.filter(
    (u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      String(getUserId(u)).toLowerCase().includes(q)
  );
};

export const selectTotalUnreadCount = (state) => {
  const unread = state.chat.users.unread;
  return Object.values(unread).reduce((sum, count) => sum + count, 0);
};

