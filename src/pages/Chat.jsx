import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chatWebSocket } from "@/lib/chatWebSocket";
import { messageAPI } from "@/api/message.api";
import { getToken } from "@/utils/jwt-helper";
import { selectUserId, loadUserProfile } from "@/store/userProfileSlice";
import toast from "react-hot-toast";
import { Send, MessageCircle } from "lucide-react";

export default function Chat() {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const ADMIN_ID = "ca271b76-eb75-4d15-9ebc-e863f2068649"; // Admin ID cố định
  const [adminName] = useState("Support");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load chat history with admin
  const loadChatData = useCallback(async () => {
    console.log("🔄 loadChatData called");
    try {
      setLoading(true);
      console.log("📡 Loading chat data...");
      
      // Load current user profile if not loaded
      if (!currentUserId) {
        console.log("👤 Loading user profile...");
        await dispatch(loadUserProfile()).unwrap();
      }
      
      // Load chat history with admin (using fixed admin ID)
      console.log("📜 Loading chat history for admin:", ADMIN_ID);
      const historyResponse = await messageAPI.getChatHistory(ADMIN_ID);
      console.log("📨 Chat history response:", historyResponse);
      
      // axiosClient interceptor already returns response.data
      const messages = Array.isArray(historyResponse) 
        ? historyResponse 
        : (historyResponse?.data || []);
      
      console.log("💬 Loaded messages:", messages);
      setMessages(messages);
      
      // Mark messages as read
      try {
        await messageAPI.markAsRead(ADMIN_ID);
        console.log("✅ Messages marked as read");
      } catch (err) {
        console.error("❌ Failed to mark as read:", err);
      }
      
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("❌ Error loading chat data:", error);
      toast.error("Failed to load chat");
    } finally {
      setLoading(false);
      console.log("✅ loadChatData completed");
    }
  }, [currentUserId, dispatch, scrollToBottom]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((type, data) => {
    if (type === "status") {
      setConnectionStatus(data.status);
      if (data.status === "connected") {
        toast.success("Connected to chat");
      } else if (data.status === "error") {
        toast.error("Chat connection error");
      }
    } else if (type === "message") {
      // New message received - only add if message is from admin
      if (data.senderId === ADMIN_ID) {
        const newMessage = {
          id: data.id,
          content: data.content,
          senderId: data.senderId,
          receiverId: data.receiverId,
          createdAt: data.createdAt,
          read: data.read,
          isReceived: true,
        };
        
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => scrollToBottom(), 0);
        
        // Mark as read
        messageAPI.markAsRead(data.senderId).catch(console.error);
      }
    } else if (type === "sent") {
      console.log("Message sent successfully:", data.messageId);
    } else if (type === "error") {
      toast.error(`Error: ${data.message}`);
    }
  }, [scrollToBottom]);

  // Initialize WebSocket when component mounts
  useEffect(() => {
    console.log("🚀 Chat component mounted, initializing WebSocket...");
    const token = getToken();
    if (!token) {
      console.error("❌ No token found");
      toast.error("Please login first");
      setLoading(false);
      return;
    }
  
    console.log("✅ Token found, setting up WebSocket...");
    const listenerId = "user-chat";
    
    // Add listener
    chatWebSocket.addListener(listenerId, handleWebSocketMessage);
    console.log("👂 Added WebSocket listener");
  
    // Chỉ connect **nếu chưa kết nối** (singleton)
    if (!chatWebSocket.isConnected() && !chatWebSocket.getIsConnecting()) {
      console.log("🔌 Connecting WebSocket...");
      chatWebSocket.connect(token).catch((error) => {
        console.error("❌ Failed to connect WebSocket:", error);
      });
    } else {
      console.log("🔌 WebSocket already connected or connecting");
    }
  
    return () => {
      console.log("🧹 Cleaning up Chat component WebSocket listener");
      chatWebSocket.removeListener(listenerId);
      // **Không disconnect socket**, singleton giữ connection
    };
  }, [handleWebSocketMessage]);

  // Load chat data when component mounts or when dependencies change
  useEffect(() => {
    console.log("📥 useEffect for loadChatData triggered, currentUserId:", currentUserId);
    const token = getToken();
    if (token) {
      loadChatData();
    }
  }, [loadChatData, currentUserId]);


  const sendMessage = () => {
    if (!text.trim()) return;

    if (!chatWebSocket.isConnected()) {
      toast.error("Chat is not connected");
      return;
    }

    const messageContent = text.trim();
    const success = chatWebSocket.sendMessage(ADMIN_ID, messageContent);
    
    if (success) {
      // Add message to UI optimistically
      const newMessage = {
        id: Date.now(),
        content: messageContent,
        senderId: currentUserId,
        receiverId: ADMIN_ID,
        createdAt: new Date().toISOString(),
        isSent: true,
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setText("");
      scrollToBottom();
    } else {
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-semibold text-gray-800">
            Chat with {adminName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" ? "bg-green-500" : "bg-orange-500"
          }`}></span>
          <span className="text-sm text-gray-600 capitalize">
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 border border-gray-200 rounded-xl overflow-y-auto p-4 bg-gray-50 mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
            <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">No messages yet.</p>
            <p className="text-sm">Start a conversation with support!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            // Determine if message is sent by current user
            // Message is sent by me if:
            // 1. It has isSent flag, OR
            // 2. senderId matches currentUserId, OR
            // 3. receiverId matches adminId (meaning I sent it to admin)
            const msgSenderId = msg.senderId;
            const msgReceiverId = msg.receiverId;
            const isSentByMe = msg.isSent || 
                              (msgSenderId === currentUserId) || 
                              (msgReceiverId === ADMIN_ID && msgSenderId === currentUserId);
            
            return (
              <div
                key={msg.id || i}
                className={`flex flex-col max-w-[70%] animate-[messageSlide_0.3s_ease-out] ${
                  isSentByMe ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div className={`px-4 py-3 rounded-2xl break-words ${
                  isSentByMe 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
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

      {/* Input */}
      <div className="flex items-center gap-3">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={connectionStatus !== "connected"}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        />
        <button 
          onClick={sendMessage}
          disabled={!text.trim() || connectionStatus !== "connected"}
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold flex items-center gap-2 transition-all hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}
