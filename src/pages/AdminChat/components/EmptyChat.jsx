import { MessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <MessageSquare className="w-16 h-16 opacity-50 mb-3" />
      <h3 className="text-lg font-medium">Select a conversation</h3>
    </div>
  );
}
