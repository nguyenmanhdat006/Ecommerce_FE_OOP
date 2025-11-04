import { useEffect, useState } from "react";
import { orderAPI } from "@/api/order.api";
import dayjs from "dayjs";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const statusTabs = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Vận chuyển", value: "SHIPPING" },
    { label: "Chờ giao hàng", value: "WAIT_DELIVER" },
    { label: "Hoàn thành", value: "PAID" },
    { label: "Đã hủy", value: "CANCELED" },
    { label: "Trả hàng/Hoàn tiền", value: "REFUND" },
  ];

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await orderAPI.getAll();
        console.log("Orders:", res);
        setOrders(res);
      } catch (err) {
        console.error(err);
        alert("Không lấy được danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  // Xác định trạng thái kế tiếp khi ấn "Xác nhận"
  const getNextStatus = current => {
    switch (current) {
      case "PENDING":
        return "SHIPPING";
      case "SHIPPING":
        return "WAIT_DELIVER";
      case "WAIT_DELIVER":
        return "PAID";
      default:
        return current; // các trạng thái khác giữ nguyên
    }
  };

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter(o => o.status === selectedStatus);

  if (loading)
    return (
      <div className="p-6 text-gray-600">
        Đang tải danh sách đơn hàng...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tabs trạng thái */}
      <div className="flex gap-4 border-b mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            className={`pb-2 text-sm font-medium ${
              selectedStatus === tab.value
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
            onClick={() => setSelectedStatus(tab.value)}
          >
            {tab.label}{" "}
            {tab.value !== "ALL" &&
              `(${orders.filter(o => o.status === tab.value).length})`}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Không có đơn hàng nào trong trạng thái này.
        </div>
      )}

      {filteredOrders.map(order => (
        <div
          key={order.id}
          className="border rounded-lg mb-5 bg-white shadow-sm overflow-hidden"
        >
          {/* Header đơn hàng */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b">
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                Mã đơn: {order.orderNumber}
              </span>{" "}
              • {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
            </div>
            <div className="flex items-center gap-2">
              {order.paymentMethod === "vnpay" && (
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    order.status === "PAID"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  }`}
                >
                  {order.status === "PAID"
                    ? "Đã thanh toán (VNPAY)"
                    : "Chưa thanh toán"}
                </span>
              )}
              <span className="text-orange-600 font-medium text-sm">
                {order.status === "PENDING"
                  ? "Chờ xác nhận"
                  : order.status === "SHIPPING"
                  ? "Đang vận chuyển"
                  : order.status === "WAIT_DELIVER"
                  ? "Chờ giao hàng"
                  : order.status === "PAID"
                  ? "Hoàn thành"
                  : order.status === "CANCELED"
                  ? "Đã hủy"
                  : "Khác"}
              </span>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="p-4 space-y-3">
            {order.orderItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex justify-between items-center border-b last:border-0 pb-2"
              >
                <div className="flex flex-col text-sm text-gray-700">
                  <span>• Sản phẩm #{idx + 1}</span>
                  <span>Số lượng: {item.quantity}</span>
                  <span>Đơn giá: {item.unitPrice.toLocaleString()}₫</span>
                </div>
                <div className="text-right font-medium text-gray-900">
                  {item.totalPrice.toLocaleString()}₫
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-t">
            <div className="text-sm text-gray-600 max-w-md">
              Địa chỉ giao hàng:{" "}
              <span className="font-medium">{order.shippingAddress}</span>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-sm">Tổng tiền</div>
              <div className="text-orange-600 font-semibold text-lg">
                {order.totalAmount.toLocaleString()}₫
              </div>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t">
            {/* Nút xác nhận ở mọi trạng thái */}
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() =>
                handleStatusChange(order.id, getNextStatus(order.status))
              }
              disabled={
                order.status === "PAID" ||
                order.status === "CANCELED" ||
                order.status === "REFUND"
              }
            >
              Xác nhận
            </button>

            {/* Nút hủy */}
            {order.status !== "CANCELED" && order.status !== "PAID" && (
              <button
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 text-sm"
                onClick={() => handleStatusChange(order.id, "CANCELED")}
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
