import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Phone,
  ChevronDown,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import logo from "@/assets/logo.png";

const StoreHeader = () => {
  const { cartCount, cartTotal, wishlist, searchQuery, setSearchQuery } =
    useStore();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    setSearchQuery(localSearch);
    navigate(`/shop?q=${encodeURIComponent(localSearch)}`);
    setSearchOpen(false);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop", hasDropdown: true },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[hsl(215,25%,12%)]/95 border-b border-white/5">

      {/* ───────── MOBILE ───────── */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
          <Link to="/">
            <img src={logo} className="h-9" />
          </Link>
        </div>

        <div className="flex items-center gap-4 text-white">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </button>

          <Link to="/wishlist" className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex shadow-lg rounded-md overflow-hidden">
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm"
            />
            <button onClick={handleSearch} className="bg-primary px-4">
              GO
            </button>
          </div>
        </div>
      )}

      {/* ───────── DESKTOP ───────── */}
      <div className="hidden md:block">

        {/* TOP BAR */}
        <div className="bg-black/40 text-xs text-gray-300">
          <div className="container flex justify-between py-2">
            <div className="flex gap-5">
              <Link to="/auth" className="hover:text-white">My Account</Link>
              <Link to="/wishlist" className="hover:text-white">Wishlist</Link>
              {isAdmin && <Link to="/admin" className="text-primary">Admin</Link>}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white">
                  +254 712 345 678
                </span>
              </div>

              {user ? (
                <button onClick={signOut} className="hover:text-white flex gap-1">
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              ) : (
                <Link to="/auth">Sign In</Link>
              )}
            </div>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="container flex items-center gap-8 py-4">

          {/* LOGO */}
          <Link to="/" className="shrink-0">
            <img src={logo} className="h-12" />
          </Link>

          {/* SEARCH */}
          <div className="flex-1 flex max-w-2xl">
            <div className="flex w-full shadow-lg rounded-md overflow-hidden focus-within:ring-2 ring-primary transition">
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 text-sm outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-primary px-6 text-sm font-bold hover:opacity-90"
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-6">

            <Link to="/wishlist" className="relative hover:scale-110 transition">
              <Heart className="w-6 h-6 text-white" />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="flex items-center gap-2 hover:scale-105 transition">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </div>
              <span className="text-sm font-semibold text-white">
                KSh {cartTotal.toLocaleString()}
              </span>
            </Link>

            <button onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </button>

          </div>
        </div>

        {/* NAV */}
        <nav className="border-t border-white/5">
          <div className="container flex gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="px-5 py-3 text-sm font-semibold text-white hover:text-primary relative group"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="inline w-3 h-3 ml-1" />}

                {/* underline animation */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all"></span>
              </Link>
            ))}
          </div>
        </nav>

      </div>

      {/* ───────── MOBILE MENU ───────── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex justify-between p-4 text-white">
            <span>Menu</span>
            <button onClick={() => setMenuOpen(false)}><X /></button>
          </div>

          <div className="flex flex-col gap-5 px-6 text-lg text-white">
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-6 flex flex-col gap-4 text-white">
            <a href="tel:+254712345678" className="flex gap-2"><Phone /> Call</a>
            <button onClick={toggleTheme} className="flex gap-2">
              {theme === "light" ? <Moon /> : <Sun />} Theme
            </button>
          </div>
        </div>
      )}

      {/* 🔥 SHARED STYLES */}
      <style>{`
        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: hsl(var(--primary));
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </header>
  );
};

export default StoreHeader;
