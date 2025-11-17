import ChatLayout from "./ChatLayout";
import Sidebar from "./components/SideBar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import EmptyChat from "./components/EmptyChat";

import { useAdminChat } from "@/hooks/useAdminChat";

export default function AdminChat() {
  const chat = useAdminChat();

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          loading={chat.usersLoading}
          viewMode={chat.viewMode}
          setViewMode={chat.setViewMode}
          searchQuery={chat.searchQuery}
          setSearchQuery={chat.setSearchQuery}
          filteredUsers={chat.filteredUsers}
          selectedUserId={chat.selectedUserId}
          loadChatUsers={chat.loadChatUsers}
          unreadCounts={chat.unreadCounts}
          loadChatHistory={chat.loadChatHistory}
          formatDate={chat.formatDate}
          getUserId={chat.getUserId}
          getUserKey={chat.getUserKey}
        />
      }
      header={
        chat.selectedUser && (
          <ChatHeader
            selectedUser={chat.selectedUser}
            selectedUserId={chat.selectedUserId}
          />
        )
      }
      messages={
        chat.selectedUser && (
          <MessageList
            messages={chat.messages}
            selectedUserId={chat.selectedUserId}
            formatTime={chat.formatTime}
            messagesEndRef={chat.messagesEndRef}
            loading={chat.messagesLoading}
          />
        )
      }
      input={
        chat.selectedUser && (
          <MessageInput
            messageText={chat.messageText}
            setMessageText={chat.setMessageText}
            sendMessage={chat.sendMessage}
            connectionStatus={chat.connectionStatus}
            handleKeyPress={chat.handleKeyPress}
          />
        )
      }
      empty={<EmptyChat />}
    />
  );
}
