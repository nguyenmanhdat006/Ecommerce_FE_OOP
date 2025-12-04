"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { orderAPI } from "@/api/order.api";
import { fetchOrders, selectOrders } from "@/store/features/order";
import UpdateOrderModal from "./UpdateOrderModal";
import { formatCurrency } from "@/utils/currencyFormatter";

export default function OrdersTable({
  activeTab,
  searchQuery,
  statusFilter,
  categoryFilter,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [deletingOrders, setDeletingOrders] = useState(new Set()); // Track which orders are being deleted
  const [updatingOrder, setUpdatingOrder] = useState(null); // Order đang được cập nhật
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  //  Gọi API khi component load
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

  // Lọc dữ liệu (nếu có search/filter)
  const filteredOrders = orders?.filter((order) => {
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
  // reload orders from server
  await dispatch(fetchOrders());
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

  // Mở modal cập nhật đơn hàng
  const handleOpenUpdateModal = (order) => {
    setUpdatingOrder(order.id);
    setIsUpdateModalOpen(true);
  };

  // Xem chi tiết đơn hàng
  const handleViewDetail = (orderId) => {
    navigate(`/admin/order-detail?orderId=${orderId}`);
  };

  // Cập nhật đơn hàng
  const handleUpdate = async (orderId, updateData) => {
    try {
  const response = await orderAPI.update(orderId, updateData);
      // API có thể trả về object trực tiếp hoặc trong response.data
      const updatedOrder = response?.data || response;
  // reload orders from server
  await dispatch(fetchOrders());
      alert("Đã cập nhật đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      alert("Không thể cập nhật đơn hàng. Vui lòng thử lại.");
      throw error;
    }
  };

  // (Đã bỏ danh sách trạng thái vì chỉ giữ tính năng xóa)

  // Loading UI
  if (loading)
    return (
      <div className="text-center p-6 text-muted-foreground">
        Đang tải dữ liệu đơn hàng...
      </div>
    );

  //  Bảng hiển thị dữ liệu
  return (
    <>
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
              {filteredOrders?.map((order) => (
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
                    {formatCurrency(order.totalAmount)}
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
                          disabled={deletingOrders.has(order.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetail(order.id)}
                          disabled={deletingOrders.has(order.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenUpdateModal(order)}
                          disabled={deletingOrders.has(order.id)}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Cập nhật đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDelete(order.id, order.orderNumber)
                          }
                          disabled={deletingOrders.has(order.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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

      <UpdateOrderModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setUpdatingOrder(null);
        }}
        orderId={updatingOrder}
        onUpdated={() => {
          // Reload danh sách đơn hàng sau khi cập nhật
          const fetchOrders = async () => {
            try {
              const res = await orderAPI.getAll();
              const data = await res;
              setOrders(data);
            } catch (error) {
              console.error("Lỗi khi tải dữ liệu:", error);
            }
          };
          fetchOrders();
        }}
      />
    </>
  );
}
