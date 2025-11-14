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
      const updateData = {
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress,
        totalAmount: parseFloat(formData.totalAmount) || order.totalAmount,
        notes: formData.notes,
      };

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho đơn hàng {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
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

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Địa chỉ giao hàng</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              placeholder="Nhập địa chỉ giao hàng"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Tổng tiền (₫)</Label>
            <Input
              id="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({ ...formData, totalAmount: e.target.value })
              }
              placeholder="Nhập tổng tiền"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Nhập ghi chú (tùy chọn)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
