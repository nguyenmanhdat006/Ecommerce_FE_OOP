import { useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getToken } from "@/utils/jwt-helper";
import { getUserId } from "@/utils/auth";
import { formatTime, formatDate } from "@/utils/date";
import {
  loadChatUsers,
  loadChatHistory,
  setMessageText,
  setViewMode,
  setSearchQuery,
  addMessage,
  updateUserLastMessage,
  markAsRead,
} from "@/store/adminChatSlice";
import {
  initSocket,
  addListener,
  removeListener,
  sendMessage,
  isConnected,
} from "@/sockets";

export function useAdminChat() {
  const dispatch = useDispatch();
  const {
    users,
    selectedUser,
    messages,
    messageText,
    connectionStatus,
    unreadCounts,
    loading,
    viewMode,
    searchQuery,
  } = useSelector((state) => state.adminChatSlice);

  const messagesEndRef = useRef(null);
  const currentUserId = useRef(null);

  // Load users from API
  const fetchUsers = useCallback(() => {
    dispatch(loadChatUsers(viewMode)).unwrap().catch(() => {
      toast.error("Failed to load users");
    });
  }, [dispatch, viewMode]);

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
          markAsRead(data.senderId).unwrap().catch(() => {
            toast.error("Failed to mark as read");
          });
        } else {
          toast.success("New message received");
          dispatch(addMessage(newMsg)); // will update unreadCounts in slice
        }

        // Update user's last message
        dispatch(
          updateUserLastMessage({
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
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080"}/ws/chat?token=${token}`;
    initSocket(wsUrl);
    addListener("admin-chat", handleSocketMessage);
    return () => removeListener("admin-chat");
  }, [handleSocketMessage]);

  // Load users on mount / viewMode change
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
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const uid = getUserId(u);
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(uid).toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  return {
    users,
    filteredUsers,
    selectedUser,
    selectedUserId: getUserId(selectedUser),
    messages,
    messageText,
    connectionStatus,
    unreadCounts,
    loading,
    viewMode,
    searchQuery,

    // setters
    setMessageText: (text) => dispatch(setMessageText(text)),
    setViewMode: (mode) => dispatch(setViewMode(mode)),
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),

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
