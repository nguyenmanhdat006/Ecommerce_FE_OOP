"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/currencyFormatter";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "SHIPPING", label: "Đang vận chuyển" },
  { value: "WAIT_DELIVER", label: "Chờ giao hàng" },
  { value: "PAID", label: "Hoàn thành" },
  { value: "CANCELED", label: "Đã hủy" },
  { value: "REFUND", label: "Trả hàng/Hoàn tiền" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "cod", label: "Thanh toán khi nhận hàng" },
  { value: "vnpay", label: "VNPay" },
  { value: "creditCard", label: "Thẻ tín dụng" },
];

export default function UpdateOrderModal({ isOpen, onClose, order, onUpdate }) {
  const [formData, setFormData] = useState({
    status: "",
    paymentMethod: "",
    shippingAddress: "",
    totalAmount: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // Khởi tạo form data khi order thay đổi và load ghi chú từ localStorage
  useEffect(() => {
    if (order) {
      // Load ghi chú từ localStorage trước
      const savedNote = localStorage.getItem(`order_note_${order.id}`);

      setFormData({
        status: order.status || "",
        paymentMethod: order.paymentMethod || "",
        shippingAddress: order.shippingAddress || "",
        totalAmount: order.totalAmount?.toString() || "",
        notes: savedNote || order.notes || "",
      });
    }
  }, [order]);

  // Lưu ghi chú vào localStorage khi người dùng nhập
  useEffect(() => {
    if (order?.id && formData.notes !== undefined) {
      // Debounce để tránh lưu quá nhiều lần
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(`order_note_${order.id}`, formData.notes);
        } catch (error) {
          console.error("Lỗi khi lưu ghi chú vào localStorage:", error);
        }
      }, 500); // Lưu sau 500ms khi người dùng ngừng gõ

      return () => clearTimeout(timeoutId);
    }
  }, [formData.notes, order?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    try {
  // Only update status to avoid calling backend 'update' (not implemented).
  // The centralized handler in OrdersTable will call updateStatus when only status is provided.
  const updateData = { status: formData.status };

  await onUpdate(order.id, updateData);
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Cập nhật đơn hàng</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Cập nhật trạng thái cho đơn hàng <span className="font-medium">{order.orderNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left: form controls (span 2 columns on md) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="status" className="mb-2">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="mb-2">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Thêm ghi chú cho nội bộ"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </div>

          {/* Right: order summary */}
          <aside className="md:col-span-1 bg-muted p-4 rounded-md">
            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Người mua</div>
              <div className="font-medium">{
                order?.customerName ||
                order?.customer?.fullName ||
                order?.user?.fullName ||
                order?.userName ||
                order?.buyerName ||
                order?.customer?.name ||
                order?.customer?.full_name ||
                'Khách vãng lai'
              }</div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Tổng tiền</div>
              <div className="font-medium text-lg text-orange-600">{formatCurrency(order.totalAmount)}</div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Phương thức</div>
              <div className="font-medium">{order.paymentMethod || '-'}</div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Địa chỉ</div>
              <div className="text-sm">{order.shippingAddress || '-'}</div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-muted-foreground">Sản phẩm</div>
              <div className="space-y-2 mt-2 max-h-36 overflow-y-auto">
                {order.orderItems?.map((it, i) => (
                  <div key={it.id || i} className="flex justify-between text-sm">
                    <div className="truncate">{it.productName || it.name || 'Sản phẩm'}</div>
                    <div className="ml-2 font-medium">{it.quantity}x</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </form>
      </DialogContent>
    </Dialog>
  );
}
