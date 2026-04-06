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
    <header className=" sticky top-0 z-50 
bg-green-600 
md:bg-gradient-to-r md:from-green-600 md:to-white 
shadow-lg text-white backdrop-blur-md">

      {/* ───────── MOBILE ───────── */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">

        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>

          <Link to="/">
            <img src={logo} className="h-11" />
          </Link>
        </div>

        <div className="flex items-center gap-4">

          <button onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5 text-white" />
          </button>

          <Link to="/wishlist" className="relative">
            <Heart className="w-5 h-5 text-white" />
            {wishlist.length > 0 && (
              <span className="badge">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="badge">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* MOBILE SEARCH */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex rounded-full overflow-hidden border shadow-sm bg-white">

            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch()
              }
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
            />

            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 px-4 text-white font-semibold transition"
            >
              GO
            </button>

          </div>
        </div>
      )}

      {/* ───────── DESKTOP ───────── */}
      <div className="hidden md:block">

        {/* TOP BAR */}
        <div className="bg-orange-500 text-xs text-white">

          <div className="container flex justify-between py-2">

            <div className="flex gap-5">

              <Link
                to="/auth"
                className="hover:text-yellow-300 transition"
              >
                My Account
              </Link>

              <Link
                to="/wishlist"
                className="hover:text-yellow-300 transition"
              >
                Wishlist
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="font-semibold text-yellow-300"
                >
                  Admin
                </Link>
              )}

            </div>

            <div className="flex items-center gap-6">

              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="font-medium">
                  0725798506
                </span>
              </div>

              {user ? (
                <button
                  onClick={signOut}
                  className="flex items-center gap-1 hover:text-yellow-300 transition"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              ) : (
                <Link to="/auth">
                  Sign In
                </Link>
              )}

            </div>

          </div>

        </div>

        {/* MAIN HEADER */}
        <div className="container flex items-center gap-8 py-3 bg-white text-gray-800">

          {/* LOGO */}
          <Link to="/" className="shrink-0">
            <img src={logo} className="h-14" />
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-xl">

            <div className="flex items-center rounded-full border px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-500 transition">

              <Search className="w-4 h-4 text-gray-400 mr-2" />

              <input
                value={localSearch}
                onChange={(e) =>
                  setLocalSearch(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearch()
                }
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm outline-none"
              />

              <button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-1.5 rounded-full text-xs font-bold transition"
              >
                Search
              </button>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-6">

            <Link
              to="/wishlist"
              className="relative"
            >

              <Heart className="w-6 h-6 text-gray-700 hover:text-orange-500 transition" />

              {wishlist.length > 0 && (
                <span className="badge">
                  {wishlist.length}
                </span>
              )}

            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2"
            >

              <div className="relative">

                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-500 transition" />

                {cartCount > 0 && (
                  <span className="badge">
                    {cartCount}
                  </span>
                )}

              </div>

              <span className="text-sm font-bold text-orange-500">

                KSh {cartTotal.toLocaleString()}

              </span>

            </Link>

            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border hover:bg-gray-100 transition"
            >

              {theme === "light"
                ? <Moon />
                : <Sun />}

            </button>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="border-t bg-white">

          <div className="container flex gap-6">

            {navLinks.map((link, i) => (

              <Link
                key={i}
                to={link.to}
                className="py-3 text-sm font-medium text-gray-700 hover:text-orange-500 relative group"
              >

                {link.label}

                {link.hasDropdown && (
                  <ChevronDown className="inline w-3 h-3 ml-1" />
                )}

                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all" />

              </Link>

            ))}

          </div>

        </nav>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (

        <div className="fixed inset-0 bg-white z-50 flex flex-col">

          <div className="flex justify-between p-4">

            <span className="font-bold text-lg">
              Menu
            </span>

            <button
              onClick={() => setMenuOpen(false)}
            >
              <X />
            </button>

          </div>

          <div className="flex flex-col gap-5 px-6 text-lg">

            {navLinks.map((l) => (

              <Link
                key={l.label}
                to={l.to}
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                {l.label}
              </Link>

            ))}

          </div>

        </div>

      )}

      {/* BADGE STYLE */}
      <style>{`

        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

      `}</style>

    </header>
  );
};

export default StoreHeader;