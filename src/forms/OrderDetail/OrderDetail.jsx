import React from "react";
import { ArrowLeft, Pencil, X, PackageCheck } from "lucide-react";

const order = {
  id: "ORD12345",
  date: "2025-10-28",
  customer: "Nguyễn Đức Anh",
  address: "Hà Nội, Việt Nam",
  total: "1.200.000đ",
  status: "Đã giao hàng",
  items: [
    { id: 1, name: "Tai nghe Bluetooth", quantity: 1, price: "400.000đ" },
    { id: 2, name: "Bàn phím cơ", quantity: 1, price: "800.000đ" },
  ],
};

export function OrderDetail() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: "#eee",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <h2 style={{ marginLeft: "20px" }}>Chi tiết đơn hàng #{order.id}</h2>
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Ngày đặt:</strong> {order.date}</p>
        <p><strong>Khách hàng:</strong> {order.customer}</p>
        <p><strong>Địa chỉ:</strong> {order.address}</p>
        <p><strong>Tổng tiền:</strong> {order.total}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <h3>Danh sách sản phẩm</h3>
      <div>
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>{item.name}</span>
            <span>Số lượng: {item.quantity}</span>
            <span>Giá: {item.price}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Pencil size={16} /> Chỉnh sửa
        </button>

        <button
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <X size={16} /> Hủy đơn
        </button>

        <button
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <PackageCheck size={16} /> Xác nhận
        </button>
      </div>
    </div>
  );
}
