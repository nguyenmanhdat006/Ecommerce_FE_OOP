import { useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getUserId } from "@/utils/auth";
import { formatTime, formatDate } from "@/utils/date";
import {
  // Thunks
  loadChatUsers,
  loadChatHistory,
  // Actions
  setMessageText,
  setViewMode,
  setSearch,
  addMessage,
  updateLastMessage,
  // Selectors
  selectChatUsers,
  selectSelectedUser,
  selectMessages,
  selectMessageText,
  selectConnectionStatus,
  selectUnreadCounts,
  selectUsersLoading,
  selectUsersLoaded,
  selectMessagesLoading,
  selectViewMode,
  selectSearchQuery,
  selectFilteredUsers,
} from "@/store/chat";
import { messageAPI } from "@/api/message.api";

import {
  sendMessage,
  isConnected,
} from "@/sockets";
import { useChatWebSocket } from "./useChatSocket";


export function useAdminChat() {
  const dispatch = useDispatch();
  
  // Use individual selectors from the new chat reducer
  const users = useSelector(selectChatUsers);
  const selectedUser = useSelector(selectSelectedUser);
  const messages = useSelector(selectMessages);
  const messageText = useSelector(selectMessageText);
  const connectionStatus = useSelector(selectConnectionStatus);
  const unreadCounts = useSelector(selectUnreadCounts);
  const usersLoading = useSelector(selectUsersLoading);
  const usersLoaded = useSelector(selectUsersLoaded);
  const messagesLoading = useSelector(selectMessagesLoading);
  const viewMode = useSelector(selectViewMode);
  const searchQuery = useSelector(selectSearchQuery);
  const filteredUsers = useSelector(selectFilteredUsers);
  
  // Combined loading state for backward compatibility
  const loading = usersLoading || messagesLoading;

  const messagesEndRef = useRef(null);
  const currentUserId = useRef(null);

  // Load users from API - chỉ load nếu chưa loaded hoặc force refresh
  const fetchUsers = useCallback((forceRefresh = false) => {
    if (!forceRefresh && usersLoaded) {
      return; // Đã load rồi, không cần load lại
    }
    
    dispatch(loadChatUsers()).unwrap().catch(() => {
      toast.error("Failed to load users");
    });
  }, [dispatch, usersLoaded]);

  // Load chat history for a selected user
  const fetchChatHistory = useCallback(
    (user) => {
      dispatch(loadChatHistory(user)).unwrap().catch(() => {
        toast.error("Failed to load chat history");
      });
    },
    [dispatch]
  );

  // Handle incoming WebSocket messages
  const handleSocketMessage = useCallback(
    (type, data) => {
      if (type === "status") {
        if (data.status === "connected") toast.success("Connected to chat server");
        if (data.status === "error") toast.error("Chat connection error");
        return;
      }

      if (type === "message") {
        const newMsg = {
          id: data.id,
          content: data.content,
          senderId: data.senderId,
          receiverId: data.receiverId,
          createdAt: data.createdAt,
          read: data.read,
          isReceived: true,
        };

        const selId = getUserId(selectedUser);
        if (selectedUser && selId === data.senderId) {
          dispatch(addMessage(newMsg));
          // Mark as read
          messageAPI.markAsRead(data.senderId).catch(() => {
            toast.error("Failed to mark as read");
          });
        } else {
          toast.success("New message received");
          dispatch(addMessage(newMsg)); // will update unreadCounts in slice
        }

        // Update user's last message
        dispatch(
          updateLastMessage({
            userId: data.senderId,
            content: data.content,
            createdAt: data.createdAt,
          })
        );
      }
    },
    [dispatch, selectedUser]
  );

  // Initialize WebSocket
  useChatWebSocket(handleSocketMessage, "admin-chat");

  // Load users on mount - chỉ load 1 lần duy nhất
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Send message
  const sendChatMessage = useCallback(() => {
    if (!messageText.trim() || !selectedUser) return;
    if (!isConnected()) {
      toast.error("Chat not connected");
      return;
    }

    const payload = { receiverId: getUserId(selectedUser), content: messageText };
    const ok = sendMessage(payload);
    if (!ok) return toast.error("Failed to send");

    const msg = {
      id: Date.now(),
      content: messageText,
      senderId: currentUserId.current,
      receiverId: getUserId(selectedUser),
      createdAt: new Date().toISOString(),
      isSent: true,
    };
    dispatch(addMessage(msg));
  }, [dispatch, messageText, selectedUser]);

  // Filter users based on search query

  return {
    users,
    filteredUsers,
    selectedUser,
    selectedUserId: getUserId(selectedUser),
    messages,
    messageText,
    connectionStatus,
    unreadCounts,
    loading,                    // Combined loading (backward compatibility)
    usersLoading,               // Loading riêng cho users
    messagesLoading,            // Loading riêng cho messages
    viewMode,
    searchQuery,

    // setters
    setMessageText: (text) => dispatch(setMessageText(text)),
    setViewMode: (mode) => dispatch(setViewMode(mode)),
    setSearchQuery: (query) => dispatch(setSearch(query)),

    // actions
    loadChatHistory: fetchChatHistory,
    loadChatUsers: fetchUsers,
    sendMessage: sendChatMessage,

    // utils
    messagesEndRef,
    formatDate,
    formatTime,
    getUserId,
    getUserKey: getUserId,
  };
}
