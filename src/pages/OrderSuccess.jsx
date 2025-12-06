import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, fetchMyOrders, selectOrders, selectMyOrders } from "@/store/features/order";
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
import { reviewAPI } from '@/api/review.api';
import dayjs from "dayjs";
import { toast } from 'react-hot-toast';
import { formatCurrency } from "@/utils/currencyFormatter";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const myOrders = useSelector(selectMyOrders);
  const user = useSelector(selectUserProfile);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
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
      // Fetch only the appropriate list: admin -> all orders, user -> my orders
      try {
        setLoading(true);
        if (isAdmin) {
          await dispatch(fetchOrders());
        } else {
          await dispatch(fetchMyOrders());
        }
        if (mounted) setLoading(false);
      } catch (e) {
        console.error('Failed to load orders', e);
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // gửi changedBy = "admin" (hoặc user đang đăng nhập)
  // dialog is illustrative; use updateStatus endpoint for cancellation as well
  await orderAPI.updateStatus(orderId, newStatus, "admin");
      // refresh orders from server
  if (isAdmin) await dispatch(fetchOrders());
  else await dispatch(fetchMyOrders());
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

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      handleStatusChange(orderToCancel.id, "CANCELED");
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

  // prefer myOrders if available (user view), otherwise show all orders (admin view)
  const baseList = (myOrders && myOrders.length > 0) ? myOrders : orders;
  const filteredOrders =
    selectedStatus === "ALL"
      ? baseList
      : baseList.filter(o => o.status === selectedStatus);

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
              `(${baseList.filter(o => o.status === tab.value).length})`}
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
                  <span>Đơn giá: {formatCurrency(item.unitPrice)}</span>
                  <span>SKU: {item.productVariant?.color} / {item.productVariant?.size}</span>
                </div>
                <div className="text-right font-medium text-gray-900">
                  {formatCurrency(item.totalPrice)}
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
                {formatCurrency(order.totalAmount)}
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
                onClick={() => handleCancelClick(order)}
              >
                Hủy đơn
              </button>
            )}
            {/* Review button: shown when order is PAID */}
            {order.status === 'PAID' && (
              <button
                className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 text-sm"
                onClick={() => {
                  // open review dialog for first item by default (or user can pick)
                  const firstItem = order.orderItems && order.orderItems[0];
                  // set current review item (keep original fields only)
                  setCurrentReviewItem({ ...firstItem, orderId: order.id });
                  setRating(5);
                  setComment('');
                  setReviewDialogOpen(true);
                }}
              >
                Đánh giá
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Dialog xác nhận hủy đơn */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>

          </DialogHeader>

              <div className="mt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Xác nhận hủy đơn hàng</p>
                    <p className="mt-2 text-gray-600">Hành động này sẽ chuyển đơn sang trạng thái "Đã hủy". Nếu đơn đã thanh toán bằng VNPAY, shop sẽ xử lý hoàn tiền trong thời gian ngắn nhất và admin sẽ liên hệ để xác nhận.</p>
                    {orderToCancel?.paymentMethod === "vnpay" && (
                      <div className="mt-3 text-sm text-blue-800 bg-blue-50 border border-blue-100 p-3 rounded">
                        <p className="font-medium">Đã thanh toán bằng VNPAY</p>
                        <p className="mt-1">Shop sẽ hoàn tiền trong thời gian ngắn nhất. Vui lòng bật thông báo điện thoại và kiểm tra tin nhắn để nhận cập nhật từ admin.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setOrderToCancel(null);
              }}
            >
              Quay lại
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

      {/* Review dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá sản phẩm</DialogTitle>
            <DialogDescription>Hãy để lại đánh giá và nhận xét về sản phẩm bạn đã mua.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* (preview removed: only rating and comment remain) */}

            {/* Controls: rating + comment in responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-sm font-medium block mb-2">Đánh giá</label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-3xl leading-none focus:outline-none ${n <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                      aria-label={`Rate ${n} star`}
                      title={`${n} sao`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">{rating} / 5</div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium block mb-2">Nhận xét</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={6}
                  maxLength={500}
                  className="w-full border rounded-md px-3 py-2 resize-y focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  placeholder="Mô tả trải nghiệm của bạn: chất lượng, kích thước, giao hàng... (tối đa 500 ký tự)"
                  aria-label="Review comment"
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">Cập nhật: đánh giá trung thực giúp người bán cải thiện chất lượng.</div>
                  <div className="text-xs text-gray-500">{comment.length}/500</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                if (!currentReviewItem) return;
                if (!rating || rating < 1) {
                  toast.error('Vui lòng chọn số sao (1-5)');
                  return;
                }
                if ((comment || '').trim().length < 3) {
                  toast.error('Vui lòng nhập nhận xét ít nhất 3 ký tự');
                  return;
                }

                try {
                  setSubmittingReview(true);
                  const userId = localStorage.getItem('userId') || (user && user.id) || localStorage.getItem('customerId');
                  const payload = {
                    userId,
                    productId: currentReviewItem.productId,
                    orderItemId: currentReviewItem.id,
                    rating,
                    comment: comment.trim(),
                  };
                  await reviewAPI.create(payload);
                  toast.success('Cảm ơn! Đánh giá của bạn đã được gửi.');
                  setReviewDialogOpen(false);
                  // reset local form state
                  setRating(5);
                  setComment('');
                } catch (err) {
                  console.error('Failed to submit review', err);
                  toast.error('Gửi đánh giá thất bại. Vui lòng thử lại.');
                } finally {
                  setSubmittingReview(false);
                }
              }}
              disabled={submittingReview}
            >
              {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
