// src/pages/OrderVnpSuccess.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderVnpSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    async function handleVnpayReturn() {
      const searchParams = location.search; // giữ nguyên query string

      if (!searchParams.includes("vnp_Amount")) {
        setStatusMessage("Không có dữ liệu thanh toán!");
        return;
      }

      const token = localStorage.getItem("access_token");

      try {
        const res = await axios.get(
          `http://localhost:8080/api/vnpay/return${searchParams}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200 && res.data === "Thanh toán thành công!") {
          setStatusMessage("Thanh toán thành công! Đơn hàng đã được cập nhật.");
        } else {
          setStatusMessage("Thanh toán thất bại!");
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("Có lỗi khi xử lý thanh toán!");
      }
    }

    handleVnpayReturn();
  }, [location.search]);

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 text-center border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Kết quả thanh toán</h1>
      <p className="text-gray-700">{statusMessage}</p>
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate("/order-success")}
      >
        Quay về danh sách đơn hàng
      </button>
    </div>
  );
}
