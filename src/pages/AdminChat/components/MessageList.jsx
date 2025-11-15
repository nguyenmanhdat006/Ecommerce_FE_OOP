export default function MessageList({
  messages,
  selectedUserId,
  formatTime,
  messagesEndRef
}) {
  return (
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
              className={`flex flex-col max-w-[70%] 
                ${isSentByMe ? "self-end items-end ml-auto" : "self-start items-start"}`}
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
  );
}
