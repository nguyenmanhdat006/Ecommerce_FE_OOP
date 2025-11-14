import { useEffect, useState, useRef, useCallback } from "react";
import { messageAPI } from "@/api/message.api";
import { chatWebSocket } from "@/lib/chatWebSocket";
import { getToken } from "@/utils/jwt-helper";
import toast from "react-hot-toast";
import { MessageSquare, RefreshCw, Send, Search } from "lucide-react";

export default function AdminChat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all"); // "all" or "recent"
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = useRef(null);

  // Helper function to get userId from user object (handles both id and userId)
  const getUserId = (user) => {
    if (!user) return null;
    if (typeof user === "string") return user;
    return user.userId || user.id;
  };

  // Helper function to get user key for consistent identification
  const getUserKey = (user) => {
    if (!user) return null;
    if (typeof user === "string") return user;
    return user.userId || user.id;
  };

  // Load all users or recent chat users
  const loadChatUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      if (viewMode === "all") {
        // Load all users
        const response = await messageAPI.getAllUsers();
        // axiosClient interceptor already returns response.data
        const users = Array.isArray(response) ? response : (response?.data || []);
        setUsers(users);
      } else {
        // Load only users with chat history
        const response = await messageAPI.getChatUsers();
        // axiosClient interceptor already returns response.data
        const users = Array.isArray(response) ? response : (response?.data || []);
        setUsers(users);
      }
      
      // Always load unread counts
      try {
        const unreadResponse = await messageAPI.getUnreadCount();
        // axiosClient interceptor already returns response.data
        const unreadData = Array.isArray(unreadResponse) 
          ? {} 
          : (unreadResponse?.data || unreadResponse || {});
        if (unreadData && Object.keys(unreadData).length > 0) {
          setUnreadCounts(unreadData);
        }
      } catch {
        console.log("No unread counts available");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
    
  }, [viewMode]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((type, data) => {
    if (type === "status") {
      setConnectionStatus(data.status);
      if (data.status === "connected") {
        toast.success("Connected to chat server");
      } else if (data.status === "error") {
        toast.error("Chat connection error");
      }
    } else if (type === "message") {
      // New message received
      const newMessage = {
        id: data.id,
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
        createdAt: data.createdAt,
        read: data.read,
        isReceived: true,
      };

      // Update messages if chat with this user is open
      setSelectedUser((currentSelected) => {
        const selectedUserId = getUserId(currentSelected);
        if (currentSelected && data.senderId === selectedUserId) {
          setMessages((prev) => [...prev, newMessage]);
          // Mark as read
          messageAPI.markAsRead(data.senderId).catch(console.error);
        } else {
          // Update unread count
          setUnreadCounts((prev) => ({
            ...prev,
            [data.senderId]: (prev[data.senderId] || 0) + 1,
          }));
          
          // Show notification
          toast.success(`New message from user`);
        }
        return currentSelected;
      });

      // Update user list to show last message without full reload
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const userIndex = updatedUsers.findIndex(u => {
          const userId = getUserId(u);
          return userId === data.senderId;
        });
        if (userIndex !== -1) {
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            lastMessage: data.content,
            lastMessageTime: data.createdAt
          };
          // Move to top if in recent chats mode
          const [user] = updatedUsers.splice(userIndex, 1);
          updatedUsers.unshift(user);
        }
        return updatedUsers;
      });
    } else if (type === "sent") {
      console.log("Message sent successfully:", data.messageId);
    } else if (type === "error") {
      toast.error(`Error: ${data.message}`);
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    // Connect WebSocket
    chatWebSocket.connect(token).catch((error) => {
      console.error("Failed to connect WebSocket:", error);
      toast.error("Failed to connect to chat server");
    });

    // Add message listener
    chatWebSocket.addListener("admin-chat", handleWebSocketMessage);

    return () => {
      chatWebSocket.removeListener("admin-chat");
    };
  }, [handleWebSocketMessage]);

  // Load users on mount and when view mode changes
  useEffect(() => {
    loadChatUsers();
  }, [loadChatUsers]);

  // Load chat history with selected user
  const loadChatHistory = async (user) => {
    try {
      console.log("loadChatHistory", user);
      const userId = getUserId(user);
      // Store full user object, not just ID
      setSelectedUser(user);
      setMessages([]);
      
      const response = await messageAPI.getChatHistory(userId);
      // axiosClient interceptor already returns response.data, so response is already the data
      const messages = Array.isArray(response) ? response : (response?.data || []);
      console.log("Loaded messages:", messages);
      setMessages(messages);
      
      // Mark messages as read
      await messageAPI.markAsRead(userId);
      
      // Clear unread count for this user
      setUnreadCounts((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    }
  };

  const selectedUserId = getUserId(selectedUser);
  // Send message
  const sendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    if (!chatWebSocket.isConnected()) {
      toast.error("Chat is not connected");
      return;
    }

    const userId = getUserId(selectedUser);
    console.log(selectedUser, messageText);

    const success = chatWebSocket.sendMessage(userId, messageText);
    
    if (success) {
      // Add message to UI optimistically
      const newMessage = {
        id: Date.now(),
        content: messageText,
        senderId: currentUserId.current,
        receiverId: userId,
        createdAt: new Date().toISOString(),
        isSent: true,
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
      scrollToBottom();
    } else {
      toast.error("Failed to send message");
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const userId = getUserId(user);
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      String(userId)?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">Admin Chat</h2>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" 
              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
              : connectionStatus === "error" 
              ? "bg-red-500" 
              : "bg-orange-500"
          }`}></span>
          <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* User List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Users</h3>
              <button 
                onClick={loadChatUsers}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {/* View Mode Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setViewMode("all")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setViewMode("recent")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === "recent"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Recent Chats
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No users match your search" : viewMode === "all" ? "No users found" : "No conversations yet"}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map((user) => {
                const userId = getUserId(user);
                const userKey = getUserKey(user);
                const isSelected = selectedUserId && selectedUserId === userId;
                
                return (
                  <div
                    key={userKey}
                    onClick={() => loadChatHistory(user)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {user.name || user.email || `User ${String(userId).slice(0, 8)}`}
                      </div>
                      {user.lastMessage && (
                        <div className="text-sm text-gray-600 truncate">
                          {user.lastMessage.substring(0, 30)}
                          {user.lastMessage.length > 30 ? "..." : ""}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {user.lastMessageTime && (
                        <div className="text-xs text-gray-400">
                          {formatDate(user.lastMessageTime)}
                        </div>
                      )}
                      {unreadCounts[userId] > 0 && (
                        <div className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold min-w-[20px] text-center">
                          {unreadCounts[userId]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-semibold text-lg">
                    {selectedUser.name?.[0]?.toUpperCase() || 
                     selectedUser.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {selectedUser.name || selectedUser.email || `User ${String(selectedUserId).slice(0, 8)}`}
                    </div>
                    {selectedUser.email && (
                      <div className="text-sm text-gray-600">{selectedUser.email}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSentByMe = msg.senderId !== selectedUserId;
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col max-w-[70%] animate-[messageSlide_0.3s_ease-out] ${
                          isSentByMe ? "self-end items-end ml-auto" : "self-start items-start"
                        }`}
                      >
                        <div className={`px-4 py-3 rounded-2xl break-words ${
                          isSentByMe 
                            ? "bg-blue-600 text-white rounded-br-sm" 
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 px-2">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-3 px-6 py-4 bg-white border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={connectionStatus !== "connected"}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || connectionStatus !== "connected"}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center transition-all hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a user from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

