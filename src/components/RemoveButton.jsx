// components/RemoveButton.jsx
import { X } from "lucide-react";

export function RemoveButton({ onClick, size = 16, className = "text-red-500 hover:text-red-700" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      <X size={size} />
    </button>
  );
}
