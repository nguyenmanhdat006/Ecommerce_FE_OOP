import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export default function OrderStatusToast() {
  const socketRef = useRef(null);

  const statusMessages = {
    PENDING: "Đơn hàng đã được xác nhận",
    SHIPPING: "Đơn hàng đang giao",
    WAIT_DELIVER: "Đơn hàng chờ giao",
    PAID: "Đơn hàng đã hoàn tất",
    CANCELED: "Đơn hàng đã hủy",
    REFUND: "Đơn hàng trả hàng/hoàn tiền",
  };

  useEffect(() => {
    let reconnectTimeout;

    const connect = () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        // đã có kết nối
        return;
      }

      const url = "ws://localhost:8080/ws/notification";
      console.log("Connecting WebSocket to", url);

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected for OrderStatusToast");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const message = statusMessages[data.newStatus] || data.newStatus;
          const time = new Date(data.timestamp).toLocaleString();

          toast.success(
            `${message}\nMã đơn: ${data.orderId}\nThời gian: ${time}\nNgười thực hiện: ${data.changedBy}`
          );
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      socket.onclose = () => {
        console.log(" WebSocket closed, reconnecting in 1s...");
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      // cleanup
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return null;
}
