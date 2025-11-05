import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getUser } from "@/utils/jwt-helper";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUser = getUser()?.id; // người dùng hiện tại

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = new WebSocket(
        `${import.meta.env.VITE_WEBSOCKET_URL}/ws/chat`
      );

      socketRef.current.onopen = () => console.log("WebSocket connected");

      socketRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
      };

      socketRef.current.onerror = (error) =>
        console.error("WebSocket error:", error);

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        socketRef.current = null;
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;

    const msg = {
      from: currentUser ?? "userA",
      message: text.trim(),
    };

    try {
      socketRef.current.send(JSON.stringify(msg));
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
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
          {messages.length === 0 ? (
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
              const isMe = msg.from === currentUser;
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
                      {msg.from[0].toUpperCase()}
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
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 flex items-center justify-center transition-all duration-300 z-[9998] hover:scale-110",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-600 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
          1
        </span>
      </button>
    </>
  );
};

export default ChatWidget;
