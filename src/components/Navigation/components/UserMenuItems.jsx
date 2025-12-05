import { Link, useLocation } from "react-router-dom";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UserMenuItems({ onLogout, isAuthenticated }) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { icon: UserIcon, label: t('navigation.profile'), path: "/profile" },
    { icon: Settings, label: t('navigation.settings'), path: "/settings" },
  ];

  const isActiveLink = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveLink(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center transition-colors ${
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      {isAuthenticated && (
        <button
          onClick={onLogout}
          className="flex items-center w-full text-left text-muted-foreground hover:text-foreground transition-colors text-red-600 hover:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('navigation.logOut')}
        </button>
      )}
    </div>
  );
}
