import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CreditCard, Package, User, Mail } from "lucide-react";
import { orderAPI } from "@/api/order.api";
import { formatCurrency } from "@/utils/currencyFormatter";

const OrderDetailPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  // 🔹 Gọi API khi load trang và load ghi chú từ localStorage
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Load ghi chú từ localStorage trước
    const savedNote = localStorage.getItem(`order_note_${orderId}`);
    if (savedNote) {
      setNote(savedNote);
    }

    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(orderId); 
        setOrder(res);
        // Chỉ set ghi chú từ API nếu chưa có trong localStorage
        if (!savedNote) {
          // axiosClient returns response.data already, so res is the order object
          setNote(res?.notes || "");
        }
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // 🔹 Hàm lưu ghi chú vào localStorage
  const handleSaveNote = () => {
    if (!orderId) {
      alert("Không tìm thấy ID đơn hàng!");
      return;
    }

    try {
      localStorage.setItem(`order_note_${orderId}`, note);
      alert("Đã lưu ghi chú thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu ghi chú:", error);
      alert("Không thể lưu ghi chú. Vui lòng thử lại.");
    }
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (!orderId)
    return <p className="p-6 text-red-500">Không tìm thấy ID đơn hàng.</p>;
  if (!order)
    return <p className="p-6 text-red-500">Không tìm thấy đơn hàng.</p>;

  // Badge cho trạng thái
  const getStatusBadge = (status) => {
    const colors = {
      Processing: "bg-blue-500",
      Pending: "bg-gray-500",
      Shipped: "bg-purple-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500",
    };
    return (
      <Badge className={`${colors[status] || "bg-gray-400"} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>

      {/* 1️⃣ Thông tin đơn hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" /> Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mã đơn hàng</Label>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div>
              <Label>Người mua</Label>
              <p className="font-medium">{order?.customerName || order?.customer?.fullName || order?.user?.fullName || 'Khách vãng lai'}</p>
            </div>
            <div>
              <Label>Trạng thái</Label>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
            <div>
              <Label>Ngày đặt</Label>
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <Label>Phương thức thanh toán</Label>
              <p className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {order.paymentMethod}
              </p>
            </div>
          </div>
          <Separator />
          <Label>Địa chỉ giao hàng</Label>
          <p>{order.shippingAddress}</p>
        </CardContent>
      </Card>

      {/* 2️⃣ Danh sách sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn</CardTitle>
        </CardHeader>
        <CardContent>
          {order.orderItems.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Số lượng</th>
                  <th className="p-2 border">Đơn giá</th>
                  <th className="p-2 border">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border text-center">{item.quantity}</td>
                    <td className="p-2 border text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="p-2 border text-right">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 3️⃣ Lịch sử mua hàng */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {order.purchaseHistories.length === 0 ? (
            <p>Chưa có lịch sử giao dịch.</p>
          ) : (
            <ul className="space-y-2">
              {order.purchaseHistories.map((h) => (
                <li
                  key={h.id}
                  className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      Ngày:{" "}
                      {format(new Date(h.purchaseDate), "dd/MM/yyyy HH:mm")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Trạng thái: {h.status}
                    </p>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(h.totalAmount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 4️⃣ Ghi chú nội bộ */}
      <Card>
        <CardHeader>
          <CardTitle>Ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú..."
            className="min-h-24"
          />
          <Button className="mt-3" onClick={handleSaveNote}>
            Lưu ghi chú
          </Button>
        </CardContent>
      </Card>

      {/* 5️⃣ Tổng tiền */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Tổng cộng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(order.totalAmount)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
