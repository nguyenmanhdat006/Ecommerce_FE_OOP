import React, { useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Printer,
  Mail,
  RefreshCw,
  Trash2,
  History,
  User,
  MailIcon,
  Clock,
  Package,
  CreditCard,
} from "lucide-react";

const OrderDetailPage = () => {
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [internalNote, setInternalNote] = useState(
    "Khách hàng yêu cầu giao hàng trước 10h sáng. Đã xác nhận qua điện thoại."
  );

  // Dữ liệu mẫu
  const order = {
    id: "ORD-2025-1103",
    customerId: "CUST-0891",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@example.com",
    phone: "0901234567",
    address: "123 Đường Láng, Đống Đa, Hà Nội",
    orderDate: new Date("2025-11-01T10:30:00"),
    paymentStatus: "Paid",
    paymentMethod: "Thẻ tín dụng",
    subtotal: 1590000,
    shipping: 30000,
    total: 1620000,
  };

  const statusHistory = [
    {
      date: new Date("2025-11-01T10:30:00"),
      user: "System",
      status: "Pending",
      note: "Đơn hàng được tạo",
    },
    {
      date: new Date("2025-11-01T11:15:00"),
      user: "Admin A",
      status: "Processing",
      note: "Bắt đầu xử lý",
    },
    {
      date: new Date("2025-11-02T09:00:00"),
      user: "Admin A",
      status: "Shipped",
      note: "Đã giao cho đơn vị vận chuyển",
    },
  ];

  const statusOptions = [
    { value: "Pending", label: "Chờ xử lý", color: "bg-gray-500" },
    { value: "Processing", label: "Đang xử lý", color: "bg-blue-500" },
    { value: "Shipped", label: "Đã giao", color: "bg-purple-500" },
    { value: "Delivered", label: "Đã giao thành công", color: "bg-green-500" },
    { value: "Cancelled", label: "Đã hủy", color: "bg-red-500" },
  ];

  const getStatusBadge = (status) => {
    const option = statusOptions.find((s) => s.value === status);
    return (
      <Badge className={`${option?.color} text-white`}>{option?.label}</Badge>
    );
  };

  const getPaymentBadge = (status) => {
    const colors = {
      Paid: "bg-green-500",
      Pending: "bg-yellow-500",
      Failed: "bg-red-500",
    };
    return <Badge className={`${colors[status]} text-white`}>{status}</Badge>;
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi trạng thái đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Thông tin chung & Quản lý trạng thái */}
          <div className="lg:col-span-2 space-y-6">
            {/* A. Thông tin chung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Mã đơn hàng</Label>
                    <p className="font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      ID khách hàng
                    </Label>
                    <p className="font-semibold text-blue-600">
                      {order.customerId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Họ tên</Label>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="font-semibold flex items-center gap-1">
                      <MailIcon className="w-4 h-4" />
                      {order.customerEmail}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Số điện thoại
                    </Label>
                    <p className="font-semibold">{order.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Trạng thái thanh toán
                    </Label>
                    <div className="mt-1">
                      {getPaymentBadge(order.paymentStatus)}
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm text-gray-600">
                    Địa chỉ giao hàng
                  </Label>
                  <p className="font-medium mt-1">{order.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Ngày đặt hàng</Label>
                    <p className="flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {format(order.orderDate, "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">
                      Phương thức thanh toán
                    </Label>
                    <p className="flex items-center gap-1 mt-1">
                      <CreditCard className="w-4 h-4" />
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* B. Quản lý trạng thái */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Quản lý trạng thái đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label>Trạng thái hiện tại</Label>
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${option.color}`}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Cập nhật trạng thái
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Gửi email thông báo
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    Trạng thái hiện tại:
                  </span>
                  {getStatusBadge(orderStatus)}
                </div>
              </CardContent>
            </Card>

            {/* C. Ghi chú nội bộ */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú nội bộ</CardTitle>
                <CardDescription>Chỉ admin mới xem được</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Nhập ghi chú nội bộ..."
                  className="min-h-32"
                />
                <Button className="mt-3" size="sm">
                  Lưu ghi chú
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải: Lịch sử & Tác vụ */}
          <div className="space-y-6">
            {/* D. Lịch sử thay đổi trạng thái */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Lịch sử trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusHistory.map((log, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-1" />
                        {index < statusHistory.length - 1 && (
                          <div className="w-px h-full bg-gray-300 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{log.user}</p>
                            <p className="text-xs text-gray-600">
                              {format(log.date, "dd/MM/yyyy HH:mm")}
                            </p>
                          </div>
                          {getStatusBadge(log.status)}
                        </div>
                        {log.note && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* E. Tác vụ khác */}
            <Card>
              <CardHeader>
                <CardTitle>Tác vụ khác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  In hóa đơn PDF
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Hoàn tiền (Refund)
                </Button>
                {/* Chỉ hiển thị nếu là admin cao cấp */}
                <Button className="w-full justify-start" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa đơn hàng
                </Button>
              </CardContent>
            </Card>

            {/* Tổng tiền */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle>Tổng thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span>{order.shipping.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">
                      {order.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
