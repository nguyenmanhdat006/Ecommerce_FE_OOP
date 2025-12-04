import axiosClient from "./axiosClient";
import { orderAPI } from "./order.api";

export const agentAPI = {
  // Chat với GPT Agent
  chat: async (messages) => {
    // Gọi OpenAI API qua proxy hoặc trực tiếp
    // Nếu backend có endpoint proxy, dùng axiosClient
    // Nếu không, gọi trực tiếp OpenAI API
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      // Nếu có backend proxy endpoint
      if (import.meta.env.VITE_AGENT_API_URL) {
        const result = await axiosClient.post("/api/agent/chat", { messages });
        // Backend có thể trả về string hoặc object
        return typeof result === "string" ? result : result.content || result.message || result;
      }

      // Gọi trực tiếp OpenAI API
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
        throw new Error(error.error?.message || "Failed to get response from AI");
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Không thể nhận được phản hồi từ AI";
    } catch (error) {
      console.error("Agent API error:", error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng để agent có thể xem
  getOrders: async () => {
    return orderAPI.getAll();
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId) => {
    return orderAPI.getById(orderId);
  },

  // Xác nhận đơn hàng (chuyển từ PENDING sang SHIPPING)
  confirmOrder: async (orderId) => {
    return orderAPI.updateStatus(orderId, "SHIPPING", "agent");
  },
};

