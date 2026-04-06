import { Heart, ShoppingCart, Menu, X, LogOut, Sun, Moon, Phone, ChevronDown, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import logo from "@/assets/logo.png";

/* ─── TOP BAR ─── */
const TopBar = () => {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <div className="bg-[hsl(215,25%,8%)] text-[hsl(210,20%,70%)] text-xs py-2">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/auth" className="hover:text-white transition-colors">MY ACCOUNT</Link>
          <Link to="/wishlist" className="hover:text-white transition-colors">WISHLIST</Link>
          {isAdmin && <Link to="/admin" className="hover:text-primary transition-colors font-semibold">ADMIN PANEL</Link>}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">HELLO,</span>
          {user ? (
            <button onClick={signOut} className="font-semibold text-white hover:text-primary transition-colors flex items-center gap-1">
              <LogOut className="w-3 h-3" /> SIGN OUT
            </button>
          ) : (
            <Link to="/auth" className="font-semibold text-white hover:text-primary transition-colors">SIGN IN | REGISTER</Link>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN HEADER ─── */
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
    <div className="bg-[hsl(215,25%,12%)] py-4">
      <div className="container flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="DMT Spares" className="h-12 w-auto object-contain" />
        </Link>

        {/* Search */}
        <div className="flex-1 flex items-center max-w-xl">
          <input
            type="text"
            placeholder="Search by Title, Brand, Category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 text-sm bg-white text-foreground rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-r-md text-sm font-bold hover:opacity-90 transition-opacity tracking-wide"
          >
            SEARCH
          </button>
        </div>

        {/* Helpline */}
        <div className="hidden lg:flex items-center gap-2 text-white">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <div className="text-[10px] text-[hsl(210,20%,70%)]">Helpline:</div>
            <div className="text-sm font-bold">+254 712 345 678</div>
          </div>
        </div>

        {/* Wishlist & Cart */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/wishlist" className="relative text-white hover:text-primary transition-colors">
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold">KSH {cartTotal.toLocaleString()}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── NAVIGATION ─── */
const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: "Home", to: "/", active: true },
    { label: "Shop", to: "/shop", hasDropdown: true },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container flex items-center justify-between">
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-1 ${
                link.active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-muted transition-colors" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <button className="md:hidden p-3" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
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
