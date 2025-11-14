// src/components/OrderStatusToast/OrderStatusToast.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import WebSocketManager from "@/lib/websocketManager";

export default function OrderStatusToast() {
  const managerRef = useRef(null);
  const location = useLocation();

  const statusMessages = {
    PENDING: "Đơn hàng đã được xác nhận",
    SHIPPING: "Đơn hàng đang giao",
    WAIT_DELIVER: "Đơn hàng chờ giao",
    PAID: "Đơn hàng đã hoàn tất",
    CANCELED: "Đơn hàng đã hủy",
    REFUND: "Đơn hàng trả hàng/hoàn tiền",
  };

  useEffect(() => {
    console.log("OrderStatusToast mounted, current path:", location.pathname);

    // Chỉ tạo WebSocket khi ở trang /order-success
    if (!location.pathname.startsWith("/order-success")) {
      console.log("Not /order-success, WebSocket will not connect.");
      return;
    }

    const url = "ws://localhost:8080/ws/notification"; // kiểm tra URL server WebSocket
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

        console.log("WebSocket message received:", data); // log message
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

    console.log("Calling manager.connect()...");
    manager.connect();
    console.log("manager.connect() called");

    return () => {
      console.log("OrderStatusToast unmounting, cleaning up WebSocket...");
      offMessage();
      try {
        manager.close();
      } catch (err) {
        console.error("Error closing WebSocket:", err);
      }
      managerRef.current = null;
    };
  }, [location.pathname]);

  return null;
}
