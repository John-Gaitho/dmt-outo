import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const MobileBottomNav = () => {
  const { cartCount, wishlist } = useStore();
  const { user } = useAuth();
  const location = useLocation();

  const items = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Shop", to: "/shop" },
    { icon: ShoppingCart, label: "Cart", to: "/cart", badge: cartCount },
    { icon: Heart, label: "Wishlist", to: "/shop", badge: wishlist.length },
    { icon: User, label: "Account", to: user ? "/admin" : "/auth" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
