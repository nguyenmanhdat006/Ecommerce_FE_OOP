import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, selectOrders } from "@/store/features/order";
import { orderAPI } from '@/api/order.api';
import { selectUserProfile } from "@/store/userProfileSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const user = useSelector(selectUserProfile);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  
  // Check if user is admin
  const isAdmin = user?.role === "ADMIN";

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
    let mounted = true;
    const load = async () => {
      if (!orders || orders.length === 0) {
        setLoading(true);
        await dispatch(fetchOrders());
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // gửi changedBy = "admin" (hoặc user đang đăng nhập)
      await orderAPI.updateStatus(orderId, newStatus, "admin");
      // refresh orders from server
      await dispatch(fetchOrders());
      // Đóng dialog nếu đang mở
      if (cancelDialogOpen) {
        setCancelDialogOpen(false);
        setOrderToCancel(null);
      }
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      handleStatusChange(orderToCancel, "CANCELED");
    }
  };

  const getNextStatus = current => {
    switch (current) {
      case "PENDING": return "SHIPPING";
      case "SHIPPING": return "WAIT_DELIVER";
      case "WAIT_DELIVER": return "PAID";
      default: return current;
    }
  };

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter(o => o.status === selectedStatus);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-4 bg-white border border-border rounded-lg px-6 py-4 shadow-sm">
          <svg
            className="w-8 h-8 text-black animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div>
            <div className="text-sm font-medium text-gray-900">Đang tải đơn hàng</div>
            <div className="text-xs text-gray-500">Vui lòng chờ trong giây lát...</div>
          </div>
        </div>
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
              {/* Hiển thị trạng thái thanh toán */}
              {order.paymentMethod === "vnpay" && (
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 border border-green-300">
                  Đã thanh toán (VNPAY)
                </span>
              )}

              {order.paymentMethod !== "vnpay" && order.status !== "PAID" && (
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
                  Chưa thanh toán
                </span>
              )}

              {/* Trạng thái đơn hàng */}
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
                  : order.status === "REFUND"
                  ? "Trả hàng/Hoàn tiền"
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
                  <span>SKU: {item.productVariant?.color} / {item.productVariant?.size}</span>
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
            {order.status === "PAID" ? (
              <span className="px-4 py-1 rounded bg-green-100 text-green-700 text-sm font-medium">
                Hoàn thành
              </span>
            ) : (
              // Chỉ hiển thị nút "Xác nhận" nếu user là admin và đơn chưa hủy
              isAdmin && order.status !== "CANCELED" && order.status !== "REFUND" && (
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
              )
            )}

            {!["CANCELED", "PAID", "SHIPPING", "WAIT_DELIVER"].includes(order.status) && (
              <button
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 text-sm"
                onClick={() => handleCancelClick(order.id)}
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Dialog xác nhận hủy đơn */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setOrderToCancel(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
            >
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
