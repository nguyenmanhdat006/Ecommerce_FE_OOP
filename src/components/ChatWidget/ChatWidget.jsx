import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { getUser, getToken } from "@/utils/jwt-helper";
import { chatWebSocket } from "@/lib/chatWebSocket";
import { messageAPI } from "@/api/message.api";
import { selectUserId, loadUserProfile } from "@/store/userProfileSlice";
import FloatingButton from "./FloatingButton";
import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import { ADMIN_ID, LISTENER_ID, CHAT_WIDGET_CONFIG } from "./utils/chatConstants";
import { formatMessageForWidget } from "./utils/messageUtils";

const ChatWidget = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const currentUser = getUser()?.id || currentUserId; // người dùng hiện tại

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
      const formattedMessages = historyMessages.map(msg => 
        formatMessageForWidget(msg, currentUser)
      );
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      try {
        await messageAPI.markAsRead(ADMIN_ID);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
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
        const msg = formatMessageForWidget(data, currentUser);
        setMessages((prev) => [...prev, msg]);
        
        // Mark as read
        messageAPI.markAsRead(data.senderId).catch(console.error);
      }
    } else if (type === "error") {
      console.error("WebSocket error:", data);
    }
  }, [currentUser]);

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
    chatWebSocket.addListener(LISTENER_ID, handleWebSocketMessage);

    // Connect if not already connected
    if (!chatWebSocket.isConnected() && !chatWebSocket.getIsConnecting()) {
      chatWebSocket.connect(token).catch(console.error);
    }

    // Load chat history when widget opens
    loadChatData();

    return () => {
      // Only remove listener, don't disconnect (singleton)
      chatWebSocket.removeListener(LISTENER_ID);
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
      const msg = formatMessageForWidget(
        {
          senderId: currentUser,
          receiverId: ADMIN_ID,
          content: messageContent,
          createdAt: new Date(),
        },
        currentUser
      );
      setMessages((prev) => [...prev, msg]);
      setText("");
    } else {
      console.error("Failed to send message");
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <div
        className={cn(
          "fixed bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col z-[9999] transition-all duration-300",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none",
          "origin-bottom-right"
        )}
        style={{
          bottom: `${CHAT_WIDGET_CONFIG.position.bottom}px`,
          right: `${CHAT_WIDGET_CONFIG.position.right}px`,
          width: `${CHAT_WIDGET_CONFIG.width}px`,
          height: `${CHAT_WIDGET_CONFIG.height}px`,
        }}
      >
        <ChatHeader onClose={toggleChat} />

        <ChatMessageList
          messages={messages}
          loading={loading}
          currentUser={currentUser}
          adminId={ADMIN_ID}
        />

        <ChatInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={sendMessage}
          disabled={loading}
        />
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
