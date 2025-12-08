import { cn } from "@/lib/utils";
import { formatTimestamp, isMessageFromMe } from "../utils/messageUtils";

export default function ChatMessage({ message, currentUser, adminId }) {
  const isMe = isMessageFromMe(message, currentUser, adminId);

  return (
    <div
      className={cn(
        "flex animate-in slide-in-from-bottom-2 duration-300",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {!isMe && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-xs mr-2">
          {message.from?.[0]?.toUpperCase() || "A"}
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
          {message.message}
        </p>
        <span
          className={cn(
            "text-xs mt-1 block",
            isMe
              ? "text-pink-100"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

