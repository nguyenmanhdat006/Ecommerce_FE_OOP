import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export function ActionMenu({ actions, item }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((s) => !s);
        }}
        className="p-1 rounded hover:bg-muted"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {openMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow z-50">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
                setOpenMenu(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-muted ${
                action.variant === "danger" ? "text-red-500" : ""
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
