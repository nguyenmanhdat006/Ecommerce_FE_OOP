"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import InventoryHeader from "./InventoryHeader";
import InventoryTable from "./InventoryTable";
import AddMovementModal from "./AddMovementModal";
import { stockAPI } from "@/api/stocks.api";

export function InventoryManagement() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockAPI.getAll();
      setMovements(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải dữ liệu di chuyển tồn kho. Vui lòng thử lại."
      );
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleAddMovement = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitMovement = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        movementDate: formData.movementDate
          ? new Date(formData.movementDate).toISOString()
          : new Date().toISOString(),
      };

      await stockAPI.create(payload);
      await fetchMovements();
      setIsModalOpen(false);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tạo movement. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <InventoryHeader onAddMovement={handleAddMovement} />

      <Card className="mt-6">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <InventoryTable movements={movements} isLoading={loading} />
        </CardContent>
      </Card>

      <AddMovementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMovement}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default InventoryManagement;
