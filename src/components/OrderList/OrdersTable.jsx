"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { orderAPI } from "@/api/order.api";

export default function OrdersTable({
  activeTab,
  searchQuery,
  statusFilter,
  categoryFilter,
}) {
  const [orders, setOrders] = useState([]); // dữ liệu từ API
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [updatingStatus, setUpdatingStatus] = useState(new Set()); // Track which orders are being updated
  const [deletingOrders, setDeletingOrders] = useState(new Set()); // Track which orders are being deleted

  //  Gọi API khi component load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getAll();
        console.log("res", res);
        const data = await res;
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc dữ liệu (nếu có search/filter)
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;

    if (
      searchQuery &&
      !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  //  Toggle chọn dòng
  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredOrders.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredOrders.map((o) => o.id)));
  };

  // Cập nhật trạng thái đơn hàng
  const handleStatusUpdate = async (orderId, newStatus) => {
    // Trim status để loại bỏ khoảng trắng thừa
    const trimmedStatus = newStatus.trim();

    setUpdatingStatus((prev) => new Set(prev).add(orderId));
    try {
      console.log("Đang cập nhật trạng thái:", {
        orderId,
        newStatus: trimmedStatus,
      });
      const response = await orderAPI.updateStatus(orderId, trimmedStatus);
      console.log("Cập nhật thành công:", response);

      // Cập nhật trạng thái trong local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: trimmedStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi chi tiết khi cập nhật trạng thái:", error);
      // axiosClient interceptor trả về error.response?.data hoặc { message, status }
      const errorMessage =
        error?.message ||
        (typeof error === "string"
          ? error
          : "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");

      console.error("Error object:", error);
      console.error("Error message:", errorMessage);

      alert(
        `Lỗi: ${errorMessage}\n\nVui lòng kiểm tra console để xem chi tiết lỗi.`
      );
    } finally {
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Xóa đơn hàng
  const handleDelete = async (orderId, orderNumber) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa đơn hàng ${orderNumber}? Hành động này không thể hoàn tác.`
      )
    )
      return;

    setDeletingOrders((prev) => new Set(prev).add(orderId));
    try {
      await orderAPI.delete(orderId);
      // Xóa đơn hàng khỏi local state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      // Xóa khỏi selectedRows nếu có
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      alert("Đã xóa đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Không thể xóa đơn hàng. Vui lòng thử lại.");
    } finally {
      setDeletingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Danh sách các trạng thái có thể chọn
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  // Loading UI
  if (loading)
    return (
      <div className="text-center p-6 text-muted-foreground">
        Đang tải dữ liệu đơn hàng...
      </div>
    );

  //  Bảng hiển thị dữ liệu
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={
                    selectedRows.size === filteredOrders.length &&
                    filteredOrders.length > 0
                  }
                  onChange={toggleAllRows}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Mã đơn hàng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Ngày đặt hàng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Phương thức thanh toán
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Địa chỉ giao hàng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Trạng thái
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedRows.has(order.id)}
                    onChange={() => toggleRow(order.id)}
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {order.totalAmount.toLocaleString()} ₫
                </td>
                <td className="px-4 py-3 text-sm">{order.paymentMethod}</td>
                <td className="px-4 py-3 text-sm">{order.shippingAddress}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={
                          updatingStatus.has(order.id) ||
                          deletingOrders.has(order.id)
                        }
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {statusOptions.map((status) => (
                        <DropdownMenuItem
                          key={status.value}
                          onClick={() =>
                            handleStatusUpdate(order.id, status.value)
                          }
                          disabled={
                            order.status === status.value ||
                            updatingStatus.has(order.id) ||
                            deletingOrders.has(order.id)
                          }
                          className={
                            order.status === status.value
                              ? "bg-muted font-medium"
                              : ""
                          }
                        >
                          {status.label}
                          {order.status === status.value && " (hiện tại)"}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleDelete(order.id, order.orderNumber)
                        }
                        disabled={
                          updatingStatus.has(order.id) ||
                          deletingOrders.has(order.id)
                        }
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        Xóa đơn hàng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
