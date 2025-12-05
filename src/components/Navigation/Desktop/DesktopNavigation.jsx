import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { clearTokens } from "@/utils/jwt-helper";
import { toast } from "react-hot-toast";
import { UserDropdown } from "../components/UserDropdown";
import { ActionLink } from "../components/ActionLink";
import { NavLinkItem } from "../components/NavLinkItem";
import { SearchBar } from "../components/SearchBar";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { User } from "lucide-react";
import { getToken } from "@/utils/jwt-helper";
import { countCartItems } from '@/store/features/cart';
import { ROUTE_CONSTANTS } from "@/constants/routeConstants";
import { useTranslation } from "react-i18next";

export default function DesktopNavigation({ links, actions, isActiveLink }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isAuthenticated = getToken();
  const user = useSelector((state) => state.userProfile?.profile);
  const cartCount = useSelector(countCartItems) || 0;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      clearTokens();
      toast.success(t('navigation.loggedOutSuccessfully'));
      navigate("/");
    } catch (err) {
      toast.error(err?.message || t('navigation.logoutFailed'));
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="hidden md:flex gap-10 text-lg font-medium text-muted-foreground">
        {links.map((link, i) => (
          <NavLinkItem
            key={i}
            href={link.href}
            text={link.text}
            isActive={isActiveLink(link.href)}
          />
        ))}
      </nav>

      {/* Search Bar */}

      {/* Actions */}
      <div className="hidden md:flex items-center gap-5">
        <div className="block sm:hidden md:hidden lg:block">
          <SearchBar />
        </div>
        <LanguageSwitcher />
        {isAuthenticated ? (
          <>
            {user?.role === "ADMIN" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={() => navigate(ROUTE_CONSTANTS.ADMIN_PRODUCT_LIST)}
              >
                <User size={22} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-[11px] w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
            <UserDropdown user={user} onLogout={handleLogout} />
          </>
        ) : (
          actions.map((action, i) => <ActionLink key={i} action={action} />)
        )}
      </div>
    </>
  );
}
