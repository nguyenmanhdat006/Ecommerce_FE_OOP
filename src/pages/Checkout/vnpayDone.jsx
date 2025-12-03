import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '@/api/constant';
import { motion, AnimatePresence } from "framer-motion";

export default function OrderVnpSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState("Đang xử lý thanh toán...");
  const [success, setSuccess] = useState(false);

  // Lấy query params
  const queryParams = new URLSearchParams(location.search || "");
  const vnpAmount = queryParams.get("vnp_Amount");
  const vnpBankCode = queryParams.get("vnp_BankCode");
  const vnpCardType = queryParams.get("vnp_CardType");
  const vnpOrderInfo = queryParams.get("vnp_OrderInfo");
  const vnpPayDate = queryParams.get("vnp_PayDate");
  const vnpTransactionNo = queryParams.get("vnp_TransactionNo");

  // Format tiền VNĐ
  const formatMoney = (amount) => {
    if (!amount) return "-";
    const realAmount = Number(amount) / 100;
    return realAmount.toLocaleString("vi-VN") + " ₫";
  };

  // Format ngày thanh toán
  const formatDate = (payDate) => {
    if (!payDate) return "-";
    const year = payDate.slice(0, 4);
    const month = payDate.slice(4, 6);
    const day = payDate.slice(6, 8);
    const hour = payDate.slice(8, 10);
    const minute = payDate.slice(10, 12);
    const second = payDate.slice(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  useEffect(() => {
    async function handleVnpayReturn() {
      const searchParams = location.search;

      if (!searchParams.includes("vnp_Amount")) {
        setStatusMessage("Không có dữ liệu thanh toán!");
        return;
      }

      const token = localStorage.getItem("access_token");

      try {
        const base = API_BASE_URL || 'http://localhost:8080';
        const res = await axios.get(
          `${base}/api/vnpay/return${searchParams}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200 && res.data === "Thanh toán thành công!") {
          setStatusMessage("Thanh toán thành công! Đơn hàng đã được cập nhật.");
          setTimeout(() => setSuccess(true), 800);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        {!success ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
            </div>
            <h1 className="text-lg font-medium text-gray-600">{statusMessage}</h1>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div className="relative mb-5">
                  <motion.div
                    className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                      className="w-14 h-14 text-green-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 27l7 7 16-16"
                      />
                    </motion.svg>
                  </motion.div>
                </div>

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-green-600">
                  Giao Dịch Thanh Toán Thành Công
                </h2>

                <div className="h-px bg-gray-200 w-3/4 my-4"></div>

                {/* Bảng thông tin giao dịch */}
                <div className="w-full bg-gray-50 rounded-xl p-5 text-left border border-gray-100">
                  <h3 className="text-gray-800 font-semibold text-base text-center mb-4">
                    THÔNG TIN GIAO DỊCH
                  </h3>

                  <table className="w-full text-sm text-gray-700">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Nội dung thanh toán:</td>
                        <td className="py-2 font-medium text-right text-gray-900">
                          {vnpOrderInfo || "Thanh toán đơn hàng"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Cổng thanh toán:</td>
                        <td className="py-2 font-medium text-right text-gray-900">VNPAY</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Mã đơn hàng:</td>
                        <td className="py-2 font-medium text-right text-gray-900 break-all">
                          {orderId}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Mã giao dịch:</td>
                        <td className="py-2 font-medium text-right text-gray-900">
                          {vnpTransactionNo || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Ngân hàng:</td>
                        <td className="py-2 font-medium text-right text-gray-900">
                          {vnpBankCode || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Loại thẻ:</td>
                        <td className="py-2 font-medium text-right text-gray-900">
                          {vnpCardType || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Số tiền thanh toán:</td>
                        <td className="py-2 font-semibold text-right text-green-600">
                          {formatMoney(vnpAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Thời gian thanh toán:</td>
                        <td className="py-2 font-medium text-right text-gray-900">
                          {formatDate(vnpPayDate)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Nút */}
                <button
                  onClick={() => navigate("/order-success")}
                  className="mt-6 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all"
                >
                  Quay về danh sách đơn hàng
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
