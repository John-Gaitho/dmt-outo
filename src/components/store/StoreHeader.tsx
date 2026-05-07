import {
  Heart,
  ShoppingCart,
  Menu,
  X,
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

import {
  useState,
  useEffect,
  useRef,
} from "react";

import logo from "@/assets/logo.png";

const StoreHeader = () => {

  const {
    cartCount,
    cartTotal,
    wishlist,
    products,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const { user, isAdmin, signOut } =
    useAuth();

  const { theme, toggleTheme } =
    useTheme();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [shopOpen, setShopOpen] =
    useState(false);

  const [localSearch, setLocalSearch] =
    useState(searchQuery);

  const [suggestions, setSuggestions] =
    useState([]);

  const [scrolled, setScrolled] =
    useState(false);

  const searchRef = useRef(null);

  /* ================= Sticky Shrink ================= */

  useEffect(() => {

    const handleScroll = () => {

      setScrolled(
        window.scrollY > 40
      );

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  /* ================= Predictive Search ================= */

  useEffect(() => {

    if (
      localSearch.trim().length < 2
    ) {
      setSuggestions([]);
      return;
    }

    const filtered =
      products
        ?.filter((p) =>
          p.name
            .toLowerCase()
            .includes(
              localSearch.toLowerCase()
            )
        )
        .slice(0, 6);

    setSuggestions(filtered);

  }, [localSearch, products]);

  /* Close suggestions when clicking outside */

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {
        setSuggestions([]);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  /* Search submit */

  const handleSearch = () => {

    if (
      !localSearch.trim()
    )
      return;

    setSearchQuery(
      localSearch
    );

    navigate(
      `/shop?q=${encodeURIComponent(
        localSearch
      )}`
    );

    setSuggestions([]);
    setSearchOpen(false);

  };

  /* Categories */

  const categories = [
    "Air & Fuel Delivery",
    "Exterior & Accessories",
    "Headlights & Lighting",
    "Brakes & Rotors",
    "Engines & Components",
    "Electrical",
    "Interior",
    "Suspension",
  ];

  return (

<header className={`
sticky top-0 z-50
bg-white border-b
transition-all duration-300
${scrolled ? "shadow-md" : ""}
`}>

{/* ================= MOBILE HEADER ================= */}

<div className={`
flex md:hidden items-center justify-between px-4
bg-gradient-to-r from-green-600 to-green-500
${scrolled ? "py-2" : "py-3"}
`}>

<button
onClick={() =>
setMenuOpen(true)
}
className="text-white"
>
<Menu />
</button>

<Link to="/">

<img
src={logo}
alt="logo"
className={`
transition-all
${scrolled ? "h-9" : "h-11"}
`}
/>

</Link>

<div className="flex items-center gap-3">

<button
onClick={() =>
setSearchOpen(
!searchOpen
)
}
className="text-white"
>
<Search />
</button>

<Link
to="/wishlist"
className="relative"
>

<Heart className="text-white" />

{wishlist.length > 0 && (
<span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white px-1 rounded-full">
{wishlist.length}
</span>
)}

</Link>

<Link
to="/cart"
className="relative"
>

<ShoppingCart className="text-white" />

{cartCount > 0 && (
<span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white px-1 rounded-full">
{cartCount}
</span>
)}

</Link>

</div>

</div>

{/* MOBILE SEARCH */}

{searchOpen && (

<div
ref={searchRef}
className="md:hidden px-4 pb-3 bg-white"
>

<div className="relative">

<div className="flex border rounded-full px-4 py-2">

<Search className="w-4 h-4 mr-2" />

<input
value={localSearch}
onChange={(e) =>
setLocalSearch(
e.target.value
)
}
onKeyDown={(e) =>
e.key === "Enter" &&
handleSearch()
}
placeholder="Search products..."
className="flex-1 outline-none"
/>

</div>

{/* Suggestions */}

{suggestions.length > 0 && (

<div className="absolute top-full left-0 right-0 bg-white border shadow-xl rounded-xl mt-2 z-50">

{suggestions.map((p) => (

<Link
key={p.id}
to={`/product/${p.id}`}
className="block px-4 py-2 hover:bg-orange-50"
onClick={() => {

setSuggestions([]);
setSearchOpen(false);

}}
>

{p.name}

</Link>

))}

</div>

)}

</div>

</div>

)}

{/* ================= DESKTOP HEADER ================= */}

<div className="hidden md:block">

{/* TOP BAR */}

<div className="bg-orange-500 text-white text-xs">

<div className="container flex justify-between py-2">

<div className="flex gap-5">

<Link to="/auth">
My Account
</Link>

<Link to="/wishlist">
Wishlist
</Link>

{isAdmin && (
<Link to="/admin">
Admin
</Link>
)}

</div>

<div className="flex items-center gap-6">

<div className="flex items-center gap-1">

<Phone className="w-4 h-4" />

0725798506

</div>

{user ? (
<button onClick={signOut}>
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

<div className={`
container flex items-center gap-8
${scrolled ? "py-2" : "py-4"}
`}>

<Link to="/">

<img
src={logo}
alt="logo"
className={`
transition-all
${scrolled ? "h-10" : "h-14"}
`}
/>

</Link>

{/* SEARCH */}

<div
ref={searchRef}
className="flex-1 max-w-xl relative"
>

<div className="flex items-center border rounded-full px-4 py-2">

<Search className="w-4 h-4 mr-2 text-gray-400" />

<input
value={localSearch}
onChange={(e) =>
setLocalSearch(
e.target.value
)
}
onKeyDown={(e) =>
e.key === "Enter" &&
handleSearch()
}
placeholder="Search products..."
className="flex-1 outline-none"
/>

</div>

{/* Suggestions */}

{suggestions.length > 0 && (

<div className="absolute top-full left-0 right-0 bg-white border shadow-xl rounded-xl mt-2 z-50">

{suggestions.map((p) => (

<Link
key={p.id}
to={`/product/${p.id}`}
className="block px-4 py-2 hover:bg-orange-50"
onClick={() =>
setSuggestions([])
}
>

{p.name}

</Link>

))}

</div>

)}

</div>

{/* Actions */}

<div className="flex items-center gap-6">

<Link to="/wishlist" className="relative">

<Heart />

{wishlist.length > 0 && (
<span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white px-1 rounded-full">
{wishlist.length}
</span>
)}

</Link>

<Link to="/cart" className="flex items-center gap-2">

<div className="relative">

<ShoppingCart />

{cartCount > 0 && (
<span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white px-1 rounded-full">
{cartCount}
</span>
)}

</div>

<span className="font-bold text-orange-500">

KSh {cartTotal.toLocaleString()}

</span>

</Link>

<button onClick={toggleTheme}>

{theme === "light"
? <Moon />
: <Sun />}

</button>

</div>

</div>

{/* NAVIGATION + MEGA MENU */}

<nav className="border-t bg-white">

<div className="container flex gap-8">

<Link to="/">Home</Link>

<div
className="relative"
onMouseEnter={() =>
setShopOpen(true)
}
onMouseLeave={() =>
setShopOpen(false)
}
>

<div className="flex items-center gap-1">
  <Link to="/shop" className="hover:text-orange-500">
    Shop
  </Link>

  <ChevronDown className="w-3 h-3 cursor-pointer" />
</div>

{shopOpen && (

<div className="
absolute top-full left-0
w-[600px]
bg-white shadow-2xl
rounded-2xl p-6
grid grid-cols-3 gap-4
z-50
">

{categories.map((cat) => (

<Link
key={cat}
to={`/shop?category=${encodeURIComponent(cat)}`}
className="p-3 rounded-xl hover:bg-orange-50 font-medium"
>

{cat}

</Link>

))}

</div>

)}

</div>

<Link to="/blog">Blog</Link>
<Link to="/about">About</Link>
<Link to="/contact">Contact</Link>

</div>

</nav>

</div>

{/* ================= MOBILE SIDEBAR ================= */}

{menuOpen && (

<>
<div
className="fixed inset-0 bg-black/40"
onClick={() =>
setMenuOpen(false)
}
/>

<div className="fixed left-0 top-0 h-full w-[80%] max-w-xs bg-white shadow-xl p-6 overflow-y-auto">

<div className="flex justify-between mb-6">

<span className="font-bold text-lg">
Menu
</span>

<button
onClick={() =>
setMenuOpen(false)
}
>
<X />
</button>

</div>

<div className="flex flex-col gap-4">

<Link to="/" onClick={() =>
setMenuOpen(false)
}>
Home
</Link>

<Link to="/shop" onClick={() =>
setMenuOpen(false)
}>
Shop
</Link>

<div className="mt-4">

<p className="font-semibold mb-2">
Categories
</p>

<div className="flex flex-col gap-2">

{categories.map((cat) => (

<Link
key={cat}
to={`/shop?category=${encodeURIComponent(cat)}`}
onClick={() =>
setMenuOpen(false)
}
className="text-sm text-gray-600 hover:text-orange-500"
>

{cat}

</Link>

))}

</div>

</div>

<Link to="/blog">Blog</Link>
<Link to="/about">About</Link>
<Link to="/contact">Contact</Link>

</div>

</div>
</>

)}

</header>

  );

};

export default StoreHeader;