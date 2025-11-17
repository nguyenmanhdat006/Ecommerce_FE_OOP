import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getUser, getToken } from "@/utils/jwt-helper";
import { chatWebSocket } from "@/lib/chatWebSocket";
import { messageAPI } from "@/api/message.api";
import { selectUserId, loadUserProfile } from "@/store/userProfileSlice";
import FloatingButton from "./FloatingButton";

const ChatWidget = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const ADMIN_ID = "ca271b76-eb75-4d15-9ebc-e863f2068649"; // Admin ID cố định
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const listenerId = "chat-widget";
  const hasLoadedRef = useRef(false);

  const currentUser = getUser()?.id || currentUserId; // người dùng hiện tại

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history with admin
  const loadChatData = useCallback(async () => {
    if (hasLoadedRef.current) return;
    
    try {
      setLoading(true);
      hasLoadedRef.current = true;
      
      // Load current user profile if not loaded
      if (!currentUserId) {
        await dispatch(loadUserProfile()).unwrap();
      }
      
      // Load chat history with admin (using fixed admin ID)
      const historyResponse = await messageAPI.getChatHistory(ADMIN_ID);
      const historyMessages = Array.isArray(historyResponse) 
        ? historyResponse 
        : (historyResponse?.data || []);
      
      // Convert to widget format
      const formattedMessages = historyMessages.map(msg => ({
        from: msg.senderId === currentUser ? currentUser : msg.senderId,
        message: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        senderId: msg.senderId,
        receiverId: msg.receiverId,
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      try {
        await messageAPI.markAsRead(ADMIN_ID);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
      
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Error loading chat data:", error);
      hasLoadedRef.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUser, dispatch]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((type, data) => {
    if (type === "status") {
      setConnectionStatus(data.status);
      if (data.status === "connected") {
        console.log("WebSocket connected");
      } else if (data.status === "disconnected") {
        console.log("WebSocket disconnected");
      }
    } else if (type === "message") {
      // Only add if message is from admin
      if (data.senderId === ADMIN_ID) {
        const msg = {
          from: data.senderId,
          message: data.content,
          timestamp: data.createdAt ? new Date(data.createdAt) : new Date(),
          senderId: data.senderId,
          receiverId: data.receiverId,
        };
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => scrollToBottom(), 0);
        
        // Mark as read
        messageAPI.markAsRead(data.senderId).catch(console.error);
      }
    } else if (type === "error") {
      console.error("WebSocket error:", data);
    }
  }, []);

  // Setup WebSocket when widget opens
  useEffect(() => {
    if (!isOpen) {
      hasLoadedRef.current = false; // Reset when closed to allow reload on next open
      return;
    }

    const token = getToken();
    if (!token) {
      console.error("No token available for WebSocket");
      return;
    }

    // Add listener
    chatWebSocket.addListener(listenerId, handleWebSocketMessage);

    // Connect if not already connected
    if (!chatWebSocket.isConnected() && !chatWebSocket.getIsConnecting()) {
      chatWebSocket.connect(token).catch(console.error);
    }

    // Load chat history when widget opens
    loadChatData();

    return () => {
      // Only remove listener, don't disconnect (singleton)
      chatWebSocket.removeListener(listenerId);
    };
  }, [isOpen, handleWebSocketMessage, loadChatData]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!chatWebSocket.isConnected()) {
      console.error("WebSocket is not connected");
      return;
    }

    const messageContent = text.trim();
    const success = chatWebSocket.sendMessage(ADMIN_ID, messageContent);

    if (success) {
      // Add message to UI optimistically
      const msg = {
        from: currentUser ?? "userA",
        message: messageContent,
        timestamp: new Date(),
        senderId: currentUser,
        receiverId: ADMIN_ID,
      };
      setMessages((prev) => [...prev, msg]);
      setText("");
      setTimeout(() => scrollToBottom(), 0);
    } else {
      console.error("Failed to send message");
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[550px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col z-[9999] transition-all duration-300",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none",
          "origin-bottom-right"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Chat hỗ trợ</h3>
              <p className="text-xs text-pink-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="text-white hover:bg-white/20 rounded-lg h-9 w-9"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30 animate-pulse">
                <MessageCircle className="w-10 h-10" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang tải tin nhắn...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30">
                <MessageCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Xin chào! 👋
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chúng tôi có thể giúp gì cho bạn?
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              // Determine if message is sent by current user
              const isMe = msg.from === currentUser || 
                          msg.senderId === currentUser ||
                          (msg.receiverId === ADMIN_ID && msg.senderId === currentUser);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex animate-in slide-in-from-bottom-2 duration-300",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  {!isMe && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-xs mr-2">
                      {msg.from?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3",
                      isMe
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-sm shadow-md shadow-pink-500/20"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <span
                      className={cn(
                        "text-xs mt-1 block",
                        isMe
                          ? "text-pink-100"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex gap-2"
        >
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-full border-gray-300 dark:border-gray-700 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400"
          />
          <Button
            type="submit"
            disabled={!text.trim()}
            size="icon"
            className="rounded-full bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-11 h-11 flex-shrink-0 shadow-lg shadow-pink-500/30"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Floating Button */}
      <FloatingButton
        onClick={toggleChat}
        show={!isOpen}
      />
    </>
  );
};

export default ChatWidget;
