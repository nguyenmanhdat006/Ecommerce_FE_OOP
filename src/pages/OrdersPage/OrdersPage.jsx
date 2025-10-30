"use client";
import { useState } from "react";
import OrdersHeader from "@/components/OrderList/OrdersHeader";
import OrdersTabs from "@/components/OrderList/OrdersTabs";
import OrdersFilters from "@/components/OrderList/OrdersFilters";
import OrdersTable from "@/components/OrderList/OrdersTable";
import CreateOrderModal from "@/components/OrderList/CreateOrderModal";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Handler for order creation (update if you have API or state for orders)
  const handleCreateOrder = (data) => {
    console.log("New Order Created:", data);
    // TODO: Thêm vào danh sách đơn hàng hoặc gọi API
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <OrdersHeader onOpenCreateOrder={() => setCreateModalOpen(true)} />

        <div className="mt-8">
          <OrdersTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="mt-6 space-y-4">
          <OrdersFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        </div>

        <div className="mt-6">
          <OrdersTable
            activeTab={activeTab}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
          />
        </div>
        <CreateOrderModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateOrder}
        />
      </div>
    </main>
  );
}
