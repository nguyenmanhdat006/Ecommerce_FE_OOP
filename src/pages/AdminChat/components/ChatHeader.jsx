export default function ChatHeader({ selectedUser, selectedUserId }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 
            text-white flex items-center justify-center font-semibold text-lg">
          {selectedUser.name?.[0]?.toUpperCase() ||
           selectedUser.email?.[0]?.toUpperCase() ||
           "U"}
        </div>

        <div>
          <div className="font-semibold text-gray-800">
            {selectedUser.name || selectedUser.email || `User ${String(selectedUserId).slice(0, 8)}`}
          </div>

          {selectedUser.email && (
            <div className="text-sm text-gray-600">{selectedUser.email}</div>
          )}
        </div>
      </div>
    </div>
  );
}
