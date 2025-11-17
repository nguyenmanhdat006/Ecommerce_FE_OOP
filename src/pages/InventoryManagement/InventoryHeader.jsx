"use client";

import { Button } from "@/components/ui/button";

export default function InventoryHeader({ onAddMovement }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <p className="text-gray-600 mt-1">Track and manage stock movements</p>
      </div>
      <Button
        onClick={onAddMovement}
        className="bg-black text-white hover:bg-gray-800"
      >
        + Add Movement
      </Button>
    </div>
  );
}
