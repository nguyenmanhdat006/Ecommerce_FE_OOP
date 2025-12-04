import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Users,
  MessageSquare,
  Bot,
  ItalicIcon as AnalyticsIcon,
  FolderOpen,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { ROUTE_CONSTANTS } from "@/constants/routeConstants";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // lấy route hiện tại
  const user = useSelector((state) => state.authSlice.user);
  console.log("Sidebar User:", user);
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
      route: "/admin/dashboard",
    },
    {
      label: "E-commerce",
      icon: <ShoppingCart className="w-5 h-5" />,
      submenu: [
        // { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Product List", icon: <ShoppingCart className="w-4 h-4" />, route: ROUTE_CONSTANTS.ADMIN_PRODUCT_LIST },
        {
          label: "Add Product",
          icon: <ShoppingCart className="w-4 h-4" />,
          route: ROUTE_CONSTANTS.ADMIN_PRODUCT_ADD,
        },
        {
          label: "Order List",
          icon: <ShoppingCart className="w-4 h-4" />,
          route: ROUTE_CONSTANTS.ADMIN_ORDER_LIST,
        },
        // {
        //   label: "Order Detail",
        //   icon: <ShoppingCart className="w-4 h-4" />,
        //   route: ROUTE_CONSTANTS.ADMIN_ORDER_DETAIL,
        // },
        {
          label: "Category Type List",
          icon: <ShoppingCart className="w-4 h-4" />,
          route: ROUTE_CONSTANTS.ADMIN_CATEGORY_TYPE_LIST,
        },
        {
          label: "Category List",
          icon: <ShoppingCart className="w-4 h-4" />,
          route: ROUTE_CONSTANTS.ADMIN_CATEGORY_LIST,
        },
        {
          label: "Inventory",
          icon: <FolderOpen className="w-4 h-4" />,
          route: ROUTE_CONSTANTS.ADMIN_INVENTORY_MANAGEMENT,
        },
      ],
    },
    // {
    //   label: "Sales",
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   route: "/admin/sales",
    // },
    {
      label: "User Management",
      icon: <Users className="w-5 h-5" />,
      route: ROUTE_CONSTANTS.ADMIN_USER_LIST,
    },
    {
      label: "Chat",
      icon: <MessageSquare className="w-5 h-5" />,
      route: ROUTE_CONSTANTS.ADMIN_CHAT,
    },
    {
      label: "AI Agent",
      icon: <Bot className="w-5 h-5" />,
      route: ROUTE_CONSTANTS.ADMIN_AGENT,
    },
  ];

  // Mở submenu nếu route hiện tại nằm trong nó
  useEffect(() => {
    const expanded = navItems
      .filter(
        (item) =>
          item.submenu &&
          item.submenu.some((sub) => sub.route === location.pathname)
      )
      .map((item) => item.label);
    setExpandedItems(expanded);
  }, [location.pathname]);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-6">
          Dashboards
        </h2>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.route === location.pathname ||
              item.submenu?.some((sub) => sub.route === location.pathname);
            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (item.submenu) toggleExpand(item.label);
                    else if (item.route) navigate(item.route);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
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
                    {item.submenu.map((subitem) => {
                      const subActive = subitem.route === location.pathname;
                      return (
                        <button
                          key={subitem.label}
                          onClick={() =>
                            subitem.route && navigate(subitem.route)
                          }
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            subActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {subitem.icon}
                          <span>{subitem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div
        className="p-6 border-t border-sidebar-border cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {(user && user.firstName?.[0] + (user.lastName?.[0] || "")) ||
                "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : "Guest"}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user ? user.email : "Not signed in"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
