export const formatMessageForWidget = (msg, currentUser) => {
  return {
    from: msg.senderId === currentUser ? currentUser : msg.senderId,
    message: msg.content,
    timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
    senderId: msg.senderId,
    receiverId: msg.receiverId,
  };
};


export const isMessageFromMe = (msg, currentUser, adminId) => {
  return (
    msg.from === currentUser ||
    msg.senderId === currentUser ||
    (msg.receiverId === adminId && msg.senderId === currentUser)
  );
};


export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

