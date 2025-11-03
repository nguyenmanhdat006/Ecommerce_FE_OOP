import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Lock,
  LogOut,
} from "lucide-react";

const menuItems = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "address", label: "Manage Address", icon: MapPin },
  { id: "payment", label: "Payment Method", icon: CreditCard },
  { id: "password", label: "Password Manager", icon: Lock },
  { id: "logout", label: "Logout", icon: LogOut },
];

export default function ProfileSidebar({ activeSection, onSectionChange }) {
  return (
    <div className="flex flex-col gap-2">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
