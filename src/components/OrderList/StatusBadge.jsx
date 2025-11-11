export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase?.() || "unknown";

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-orange-100 text-orange-700 border border-orange-200",
    },
    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    shipped: {
      label: "Shipped",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    processing: {
      label: "Processing",
      className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700 border border-red-200",
    },
    refunded: {
      label: "Refunded",
      className: "bg-gray-100 text-gray-700 border border-gray-200",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
