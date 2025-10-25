import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Users,
  ItalicIcon as AnalyticsIcon,
  FolderOpen,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState(["E-commerce"]);
  const navigate = useNavigate();
  const toggleExpand = (label) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const navItems = [
    {
      label: "Dashboards",
      icon: <LayoutDashboard className="w-5 h-5" />,
      // onClick: () => navigate("/admin/productManagement"),
    },
    {
      label: "Default",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "E-commerce",
      icon: <ShoppingCart className="w-5 h-5" />,
      submenu: [
        { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Product List", icon: <ShoppingCart className="w-4 h-4" /> },
        { label: "Product Detail", icon: <ShoppingCart className="w-4 h-4" /> },
        {
          label: "Add Product",
          icon: <ShoppingCart className="w-4 h-4" />,
          onClick: () => navigate("/admin/addProduct"),
        },
        { label: "Order List", icon: <ShoppingCart className="w-4 h-4" /> },
        { label: "Order Detail", icon: <ShoppingCart className="w-4 h-4" /> },
      ],
    },
    {
      label: "Sales",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "CRM",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Website Analytics",
      icon: <AnalyticsIcon className="w-5 h-5" />,
    },
    {
      label: "Project Management",
      icon: <FolderOpen className="w-5 h-5" />,
      submenu: [
        { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Project List", icon: <FolderOpen className="w-4 h-4" /> },
      ],
    },
    {
      label: "File Manager",
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      label: "Crypto",
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-6">
          Dashboards
        </h2>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => item.submenu && toggleExpand(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.label === "Product List"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.submenu && (
                  <span>
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>

              {item.submenu && expandedItems.includes(item.label) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.label}
                      onClick={() => subitem.onClick && subitem.onClick()}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        subitem.label === "Product List"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {subitem.icon}
                      <span>{subitem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">TB</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Toby Belhome
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              hello@tobybelhome.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
