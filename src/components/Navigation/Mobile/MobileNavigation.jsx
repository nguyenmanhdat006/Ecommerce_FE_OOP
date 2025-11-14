import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { clearTokens } from "@/utils/jwt-helper";
import { toast } from "react-hot-toast";
import { NavLinkItem } from "../components/NavLinkItem";
import { ActionLink } from "../components/ActionLink";
import { UserInfoCard } from "../components/UserInfoCard";
import { UserMenuItems } from "../components/UserMenuItems";
import { SearchBar } from "../components/SearchBar";

export default function MobileNavigation({
  name,
  homeUrl,
  links,
  actions,
  isActiveLink,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.authSlice);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      clearTokens();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Logout failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background">
        <nav className="grid gap-6 text-lg font-semibold mt-6">
          <Link to={homeUrl} className="text-2xl font-bold">
            {name}
          </Link>
          
          {/* Search Bar for Mobile */}
          <div className="w-full">
            <SearchBar />
          </div>

          {isAuthenticated ? (
            <div className="mt-6 space-y-4">
              <UserInfoCard user={user} />
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {actions.map((action, i) => (
                <ActionLink key={i} action={action} variant="mobile" />
              ))}
            </div>
          )}

          {links.map((link, i) => (
            <NavLinkItem
              key={i}
              href={link.href}
              text={link.text}
              isActive={isActiveLink(link.href)}
              variant="mobile"
            />
          ))}

          <UserMenuItems onLogout={handleLogout} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
