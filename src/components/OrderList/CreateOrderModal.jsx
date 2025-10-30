"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CreateOrderModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    customer: "",
    email: "",
    type: "Sale",
    status: "pending",
    productImage: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setFormData((prev) => ({
          ...prev,
          productImage: imageData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.product &&
      formData.price &&
      formData.customer &&
      formData.email
    ) {
      onSubmit(formData);
      setFormData({
        product: "",
        price: "",
        customer: "",
        email: "",
        type: "Sale",
        status: "pending",
        productImage: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <Input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.productImage ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={formData.productImage || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    Drag and drop image here
                  </p>
                  <p className="text-xs text-gray-500">or click to browse</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <Input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Sale">Sale</option>
              <option value="Return">Return</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
