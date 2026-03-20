import { Search, HelpCircle, Heart, ShoppingCart, User, ChevronDown, Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import logo from "@/assets/logo.png";

const TopBar = () => {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <div className="bg-shop-topbar text-shop-topbar py-1.5 text-xs">
      <div className="container flex items-center justify-between">
        <span className="hidden md:inline">Hi! Welcome to DMT online store.</span>
        <div className="flex items-center gap-4">
          <Link to="/shop" className="hover:text-primary transition-colors">Catalogue</Link>
          <Link to="/faq" className="hover:text-primary transition-colors hidden md:inline">FAQ</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="font-semibold hover:text-primary transition-colors">Admin Panel</Link>}
              <button onClick={signOut} className="hover:text-primary transition-colors flex items-center gap-1"><LogOut className="w-3 h-3" /> Sign out</button>
            </>
          ) : (
            <Link to="/auth" className="font-semibold hover:text-primary transition-colors">Sign in or Register</Link>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderMain = () => {
  const { cartCount, cartTotal, wishlist, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    setSearchQuery(localSearch);
    navigate(`/shop?q=${encodeURIComponent(localSearch)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-card border-b border-border py-3">
      <div className="container flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="AutozPro" className="h-16 w-auto object-contain" />
        </Link>

        <div className="hidden lg:flex items-center bg-secondary text-secondary-foreground rounded px-3 py-2 text-sm font-medium cursor-pointer gap-1">
          <Menu className="w-4 h-4" />
          Shop by Category
        </div>

        <div className="flex-1 flex items-center max-w-2xl">
          <select className="hidden md:block bg-muted border border-border rounded-l px-3 py-2 text-sm">
            <option>All Categories</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary md:border-l-0"
            />
          </div>
          <button onClick={handleSearch} className="bg-primary text-primary-foreground px-4 py-2 rounded-r hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/faq" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="hidden xl:inline">Help Center</span>
          </Link>
          <Link to="/wishlist" className="relative flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden xl:block">
              <div className="text-[10px]">Shopping Cart</div>
              <div className="font-semibold text-foreground">KSH {cartTotal.toLocaleString()}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container flex items-center justify-between">
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {link.label}
              {link.label === "Shop" && <ChevronDown className="w-3 h-3" />}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
          <span>KSH</span>
          <span>English</span>
        </div>
        <button className="md:hidden p-3" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const StoreHeader = () => (
  <header className="sticky top-0 z-50">
    <TopBar />
    <HeaderMain />
    <Navigation />
  </header>
);

export default StoreHeader;
