import { useEffect } from "react";
import { getToken } from "@/utils/jwt-helper";
import { initSocket, addListener, removeListener } from "@/sockets";
import toast from "react-hot-toast";

export function useChatWebSocket(handleMessage, channel = "admin-chat") {
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080"}/ws/chat?token=${token}`;
    initSocket(wsUrl);
    addListener(channel, handleMessage);

    return () => removeListener(channel);
  }, [handleMessage, channel]);
}
