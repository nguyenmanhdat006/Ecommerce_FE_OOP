export default function StatusBadge({ status }) {
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
      className: "bg-gray-100 text-gray-700 border border-gray-200",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
  };

  const config = statusConfig[status] || {
    label: "Unknown",
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
