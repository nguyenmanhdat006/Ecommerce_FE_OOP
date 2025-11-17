"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function InventoryTable({ movements, isLoading = false }) {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === movements.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(movements.map((m) => m.id)));
    }
  };

  const getMovementTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "in":
      case "purchase":
        return "bg-green-100 text-green-800";
      case "out":
      case "sale":
        return "bg-red-100 text-red-800";
      case "adjustment":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Loading inventory movements...</p>
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No stock movements found</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={
                    selectedRows.size === movements.length &&
                    movements.length > 0
                  }
                  onCheckedChange={toggleAllRows}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Movement Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Previous Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                New Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Reference Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedRows.has(movement.id)}
                    onCheckedChange={() => toggleRow(movement.id)}
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {movement.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(
                      movement.movementType
                    )}`}
                  >
                    {movement.movementType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {movement.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {movement.previousStock}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {movement.newStock}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {movement.referenceType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(movement.movementDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {movement.notes || "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ⋯
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
