import { Send } from "lucide-react";

export default function MessageInput({
  messageText,
  setMessageText,
  sendMessage,
  connectionStatus,
  handleKeyPress
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white border-t border-gray-200">
      <input
        type="text"
        placeholder="Type a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={connectionStatus !== "connected"}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-full 
          focus:border-blue-600 focus:ring-2 focus:ring-blue-100 
          disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <button
        onClick={sendMessage}
        disabled={!messageText.trim() || connectionStatus !== "connected"}
        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center 
          hover:bg-blue-700 active:scale-95 disabled:bg-gray-300"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
