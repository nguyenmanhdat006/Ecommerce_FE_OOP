export default function ChatLayout({
  sidebar,
  header,
  messages,
  input,
  empty,
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white overflow-y-auto">{sidebar}</div>

        {/* Main chat panel */}
        <div className="flex-1 flex flex-col bg-white">
          {header}

          {!header && empty}
          {messages && <div className="flex-1 overflow-y-auto">{messages}</div>}

          <div className="border-t">{input}</div>
        </div>
      </div>
    </div>
  );
}
