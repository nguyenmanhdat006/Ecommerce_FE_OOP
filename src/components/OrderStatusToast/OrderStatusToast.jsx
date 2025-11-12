import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import WebSocketManager from "@/lib/websocketManager";

export default function OrderStatusToast() {
  const managerRef = useRef(null);

  const statusMessages = {
    PENDING: "Đơn hàng đã được xác nhận",
    SHIPPING: "Đơn hàng đang giao",
    WAIT_DELIVER: "Đơn hàng chờ giao",
    PAID: "Đơn hàng đã hoàn tất",
    CANCELED: "Đơn hàng đã hủy",
    REFUND: "Đơn hàng trả hàng/hoàn tiền",
  };

  useEffect(() => {
    const url = "ws://localhost:8080/ws/notification";
    const manager = new WebSocketManager(url, {
      autoReconnect: true,
      reconnectInterval: 1000,
    });
    managerRef.current = manager;

    manager.on("open", () => {
      console.log("WebSocket connected for OrderStatusToast");
    });

    const offMessage = manager.on("message", (event) => {
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
    });

    manager.on("error", (err) => console.error("WebSocket error:", err));

    manager.on("close", () => {
      console.log("WebSocket closed for OrderStatusToast");
    });

    manager.connect();

    return () => {
      // cleanup: unsubscribe and close
      offMessage();
      try {
        manager.close();
      } catch (err) {
        // ignore
      }
      managerRef.current = null;
    };
  }, []);

  return null;
}
