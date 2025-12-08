import { useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatEmptyState from "./ChatEmptyState";

export default function ChatMessageList({ messages, loading, currentUser, adminId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
        <ChatEmptyState
          icon={<MessageCircle className="w-10 h-10" />}
          title="Đang tải tin nhắn..."
          animate={true}
        />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
        <ChatEmptyState
          icon={<MessageCircle className="w-10 h-10" />}
          title="Xin chào! 👋"
          subtitle="Chúng tôi có thể giúp gì cho bạn?"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900 space-y-3">
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg}
          currentUser={currentUser}
          adminId={adminId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

