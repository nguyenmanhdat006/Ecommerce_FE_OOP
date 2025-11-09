"use client";

const tabs = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "PENDING" },
  { id: "SHIPPING", label: "SHIPPING" },
  { id: "WAIT_DELIVER", label: "WAIT_DELIVER" },
  { id: "PAID", label: "PAID" },
  { id: "CANCELED", label: "CANCELED" },
  { id: "REFUND", label: "REFUND" },
];

export default function OrdersTabs({ activeTab, onTabChange }) {
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
