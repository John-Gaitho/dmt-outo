import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "./ProductCard";
import { categories } from "@/data/store";

type Tab = "new" | "featured" | "popular";

const brandLogos: { name: string; icon: string }[] = [
  { name: "Toyota", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/200px-Toyota.svg.png" },
  { name: "Honda", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Honda_logo2.svg/200px-Honda_logo2.svg.png" },
  { name: "BMW", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png" },
  { name: "Ford", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/200px-Ford_Motor_Company_Logo.svg.png" },
  { name: "Mercedes", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/200px-Mercedes-Benz_Logo_2010.svg.png" },
  { name: "Subaru", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Subaru_logo.svg/200px-Subaru_logo.svg.png" },
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

  const displayProducts = filteredProducts.slice(0, 6);

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
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => isMobile && setCatOpen(!catOpen)}
                className="w-full bg-primary px-4 py-3 flex items-center justify-between"
              >
                <h3 className="text-sm font-bold text-primary-foreground tracking-wide">CATEGORIES</h3>
                {isMobile && (
                  <ChevronDown className={`w-4 h-4 text-primary-foreground transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
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

            {/* Brands with real logos */}
            <div className="mt-6 bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-bold text-foreground mb-4 tracking-wide">BRANDS</h3>
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
                    <span className="text-[10px] font-semibold text-muted-foreground">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h2 className="text-xl font-bold text-foreground">
                WHAT <span className="text-primary">WE OFFER</span>
              </h2>

              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
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
                  <button className="p-1.5 border border-border rounded hover:bg-muted transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 border border-border rounded hover:bg-muted transition-colors">
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
