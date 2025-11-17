"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddMovementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    movementType: "in",
    quantity: "",
    previousStock: "",
    newStock: "",
    referenceId: "",
    referenceType: "Order",
    movementDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.movementType ||
      !formData.quantity ||
      !formData.previousStock ||
      !formData.newStock
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      movementType: formData.movementType,
      quantity: Number(formData.quantity),
      previousStock: Number(formData.previousStock),
      newStock: Number(formData.newStock),
      referenceId: formData.referenceId || "N/A",
      referenceType: formData.referenceType,
      movementDate: formData.movementDate,
      notes: formData.notes,
    });

    // Reset form
    setFormData({
      movementType: "in",
      quantity: "",
      previousStock: "",
      newStock: "",
      referenceId: "",
      referenceType: "Order",
      movementDate: new Date().toISOString().split("T")[0],
      notes: "",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
          <DialogDescription>Record a new inventory movement</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Movement Type *
              </label>
              <select
                name="movementType"
                value={formData.movementType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in">In</option>
                <option value="out">Out</option>
                <option value="adjustment">Adjustment</option>
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Previous Stock *
              </label>
              <input
                type="number"
                name="previousStock"
                value={formData.previousStock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                New Stock *
              </label>
              <input
                type="number"
                name="newStock"
                value={formData.newStock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Reference ID
              </label>
              <input
                type="text"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                placeholder="Order/Reference ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Reference Type
              </label>
              <select
                name="referenceType"
                value={formData.referenceType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Order">Order</option>
                <option value="Return">Return</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Movement Date
            </label>
            <input
              type="date"
              name="movementDate"
              value={formData.movementDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Movement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
