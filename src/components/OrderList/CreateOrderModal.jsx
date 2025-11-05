import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function CreateOrderModal({ isOpen, onClose, onSubmit }) {
  const [orderName, setOrderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ name: orderName });
    setOrderName("");
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Enter basic information to create an order.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Order name</label>
            <input
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. Order #1234"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


