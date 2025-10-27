// components/AddButton.jsx
import { Plus } from "lucide-react";

export function AddButton({ onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <Plus size={16} />
      {title}
    </button>
  );
}
