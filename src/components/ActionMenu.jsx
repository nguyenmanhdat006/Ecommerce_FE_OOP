import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export function ActionMenu({ actions, item, ariaLabel = 'Actions' }) {
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
        aria-label={ariaLabel}
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((s) => !s);
        }}
        className="p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-1"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {openMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-background border rounded shadow-lg z-50 overflow-hidden">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
                setOpenMenu(false);
              }}
              className={`flex items-start gap-2 w-full text-left px-3 py-2 hover:bg-muted ${
                action.variant === "danger" ? "text-red-600" : "text-foreground"
              }`}
            >
              {action.icon && <span className="w-5 h-5 mt-0.5">{action.icon}</span>}
              <div className="flex-1">
                <div className="text-sm">{action.label}</div>
                {action.subtitle && <div className="text-xs text-muted-foreground">{action.subtitle}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
