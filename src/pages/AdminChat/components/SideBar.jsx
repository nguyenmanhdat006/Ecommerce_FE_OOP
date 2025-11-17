import { RefreshCw, Search } from "lucide-react";
import UserItem from "./UserItem.jsx";

export default function Sidebar({
  loading,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  selectedUserId,
  loadChatUsers,
  unreadCounts,
  loadChatHistory,
  getUserId,
  getUserKey,
  formatDate
}) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
          <button 
            onClick={() => loadChatUsers(true)}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh users list"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode("all")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setViewMode("recent")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === "recent"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Recent Chats
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm 
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* User list */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchQuery ? "No users match your search" : 
           viewMode === "all" ? "No users found" : "No conversations yet"}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <UserItem
              key={getUserKey(user)}
              user={user}
              userId={getUserId(user)}
              selected={selectedUserId === getUserId(user)}
              unread={unreadCounts[getUserId(user)]}
              onClick={() => loadChatHistory(user)}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
