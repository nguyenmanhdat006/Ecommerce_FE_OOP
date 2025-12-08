"use client";
import { useTranslation } from "react-i18next";

export default function OrdersTabs({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  
  const tabs = [
    { id: "all", label: t('admin.orders.all') },
    { id: "PENDING", label: t('admin.orders.pending') },
    { id: "SHIPPING", label: t('admin.orders.shipping') },
    { id: "WAIT_DELIVER", label: t('admin.orders.waitDeliver') },
    { id: "PAID", label: t('admin.orders.paid') },
    { id: "CANCELED", label: t('admin.orders.canceled') },
    { id: "REFUND", label: t('admin.orders.refund') },
  ];

  return (
    <div className="flex gap-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-1 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
