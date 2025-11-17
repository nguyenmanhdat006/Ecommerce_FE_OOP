export default function UserItem({
  user,
  userId,
  selected,
  unread,
  onClick,
  formatDate,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer 
        border-b border-gray-100 transition-colors hover:bg-gray-50 
        ${selected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}
    >
      <div
        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 
          text-white flex items-center justify-center font-semibold text-lg"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        ) : user.firstName?.[0]?.toUpperCase() &&
          user.lastName?.[0]?.toUpperCase() ? (
          `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
        ) : (
          user.email?.[0]?.toUpperCase() || "U"
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email || `User ${String(userId).slice(0, 8)}`}
        </div>

        {user.lastMessage && (
          <div className="text-sm text-gray-600 truncate">
            {user.lastMessage}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1">
        {user.lastMessageTime && (
          <div className="text-xs text-gray-400">
            {formatDate(user.lastMessageTime)}
          </div>
        )}

        {unread > 0 && (
          <div className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold min-w-[20px] text-center">
            {unread}
          </div>
        )}
      </div>
    </div>
  );
}
