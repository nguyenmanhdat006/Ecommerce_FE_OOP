"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

const mockOrders = [
  {
    id: "1",
    orderNumber: "#12342",
    product: "Wireless Headphones",
    productImage: "/wireless-headphones.jpg",
    price: 200,
    customer: "Liam Johnson",
    email: "liam@example.com",
    date: "Jun 23, 2023",
    type: "Sale",
    status: "pending",
  },
  {
    id: "2",
    orderNumber: "#24342",
    product: "Bluetooth Speaker",
    productImage: "/bluetooth-speaker.jpg",
    price: 150,
    customer: "Emma Brown",
    email: "emma@example.com",
    date: "Jul 11, 2023",
    type: "Sale",
    status: "completed",
  },
  {
    id: "3",
    orderNumber: "#32183",
    product: "Smartwatch",
    productImage: "/modern-smartwatch.png",
    price: 250,
    customer: "Noah Williams",
    email: "noah@example.com",
    date: "Aug 03, 2023",
    type: "Return",
    status: "pending",
  },
  {
    id: "4",
    orderNumber: "#45542",
    product: "Laptop Stand",
    productImage: "/laptop-stand.png",
    price: 320,
    customer: "Olivia Garcia",
    email: "olivia@example.com",
    date: "Sep 15, 2023",
    type: "Sale",
    status: "shipped",
  },
  {
    id: "5",
    orderNumber: "#64345",
    product: "Portable Charger",
    productImage: "/portable-charger-lifestyle.png",
    price: 80,
    customer: "Elijah Jones",
    email: "elijah@example.com",
    date: "Oct 09, 2023",
    type: "Sale",
    status: "delivered",
  },
  {
    id: "6",
    orderNumber: "#64257",
    product: "USB Hub",
    productImage: "/usb-hub.png",
    price: 60,
    customer: "Ava Miller",
    email: "ava@example.com",
    date: "Nov 21, 2023",
    type: "Return",
    status: "pending",
  },
  {
    id: "7",
    orderNumber: "#74346",
    product: "4K Monitor",
    productImage: "/4k-monitor.jpg",
    price: 500,
    customer: "James Martinez",
    email: "james@example.com",
    date: "Dec 02, 2023",
    type: "Sale",
    status: "completed",
  },
  {
    id: "8",
    orderNumber: "#84322",
    product: "Mechanical Keyboard",
    productImage: "/mechanical-keyboard.png",
    price: 100,
    customer: "Sophia Anderson",
    email: "sophia@example.com",
    date: "Jan 18, 2024",
    type: "Sale",
    status: "shipped",
  },
  {
    id: "9",
    orderNumber: "#91452",
    product: "Wireless Mouse",
    productImage: "/wireless-mouse.png",
    price: 75,
    customer: "Lucas Thomas",
    email: "lucas@example.com",
    date: "Feb 27, 2024",
    type: "Return",
    status: "completed",
  },
];

export default function OrdersTable({
  activeTab,
  searchQuery,
  statusFilter,
  categoryFilter,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const filteredOrders = mockOrders.filter((order) => {
    // Filter by tab
    if (activeTab !== "all") {
      const statusMap = {
        completed: "completed",
        processed: "shipped",
        returned: "pending",
        canceled: "pending",
      };
      if (order.status !== statusMap[activeTab]) return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !order.product.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredOrders.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredOrders.map((o) => o.id)));
  };

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
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  Price
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  Date
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
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
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.productImage || "/placeholder.svg"}
                      alt={order.product}
                      className="w-10 h-10 rounded bg-muted"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {order.product}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  ${order.price}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {order.date}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {order.type}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
