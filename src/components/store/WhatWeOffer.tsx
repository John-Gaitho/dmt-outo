import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "./ProductCard";
import { categories } from "@/data/store";
import promoVideo from "@/assets/promo-3.mp4";

type Tab = "new" | "featured" | "popular";

const brandLogos: { name: string; icon: string }[] = [
  { name: "Toyota", icon: "https://i.pinimg.com/1200x/84/a2/ff/84a2ffcc555d2f1f1d0a260e67c86b1a.jpg" },
  { name: "Honda", icon: "https://i.pinimg.com/1200x/fa/49/dc/fa49dcaf6ae263e7e796590c6c610cd4.jpg" },
  { name: "Suzuki", icon: "https://i.pinimg.com/1200x/1c/9e/c6/1c9ec6156fd4bfaa456dd2e8decfd9aa.jpg" },
  { name: "Nissan", icon: "https://i.pinimg.com/736x/59/a5/26/59a526a3f6146549714f829936da41b4.jpg" },
  { name: "Mazda", icon: "https://i.pinimg.com/1200x/46/6a/5c/466a5c6f476c4163a59236b8288bc15f.jpg" },
  { name: "Subaru", icon: "https://i.pinimg.com/1200x/1d/03/06/1d0306c346c9ec9c430b8b321e6fafc5.jpg" },
];

const WhatWeOffer = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [catOpen, setCatOpen] = useState(false);
  const isMobile = useIsMobile();

  const filteredProducts = (() => {
    switch (activeTab) {
      case "featured":
        return products.filter((p) => p.featured);
      case "popular":
        return [...products].sort((a, b) => b.reviews - a.reviews);
      default:
        return [...products].sort((a, b) => b.id.localeCompare(a.id));
    }
  })();

  const displayProducts = useMemo(() => {
    const shuffled = [...filteredProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [activeTab, products]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "new", label: "NEW ARRIVALS" },
    { key: "featured", label: "FEATURED" },
    { key: "popular", label: "POPULAR" },
  ];

  const showCategories = !isMobile || catOpen;

  return (
    <section className="py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">

            {/* Categories */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => isMobile && setCatOpen(!catOpen)}
                className="w-full bg-primary px-4 py-3 flex items-center justify-between"
              >
                <h3 className="text-sm font-bold text-primary-foreground tracking-wide">
                  CATEGORIES
                </h3>
                {isMobile && (
                  <ChevronDown
                    className={`w-4 h-4 text-primary-foreground transition-transform duration-200 ${
                      catOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {showCategories && (
                <ul className="animate-fade-in">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-muted border-b border-border transition-colors"
                      >
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-xs">{cat.count}</span>
                          <Arrow className="w-3 h-3" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Brands - Hidden on mobile */}
            <div className="hidden lg:block mt-6 bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-bold text-foreground mb-4 tracking-wide">
                BRANDS
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {brandLogos.map((brand) => (
                  <Link
                    key={brand.name}
                    to={`/shop?q=${encodeURIComponent(brand.name)}`}
                    className="flex flex-col items-center gap-1 p-2 border border-border rounded hover:border-primary hover:shadow-sm transition-all"
                  >
                    <img
                      src={brand.icon}
                      alt={brand.name}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 🎥 Video Promo Banner */}
            <div className="mt-6 relative overflow-hidden rounded-lg border border-border">
              <video
  className="w-full h-70 object-cover"
  src={promoVideo}
  autoPlay
  loop
  muted
  playsInline
/>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-xs font-semibold tracking-wide">
                    QUALITY PARTS
                  </p>
                  <h4 className="text-white font-bold text-sm">
                    FOR EVERY CAR
                  </h4>
                </div>
              </div>
            </div>

          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h2 className="text-xl font-bold text-foreground">
                WHAT <span className="text-primary">WE OFFER</span>
              </h2>

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
                        activeTab === tab.key
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 ml-2">
                  <button className="p-1.5 border border-border rounded hover:bg-muted">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 border border-border rounded hover:bg-muted">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;