"use client";

const tabs = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "processed", label: "Processed" },
  { id: "returned", label: "Returned" },
  { id: "canceled", label: "Canceled" },
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
