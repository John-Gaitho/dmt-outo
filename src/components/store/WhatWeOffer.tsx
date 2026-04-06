import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";
import { categories } from "@/data/store";

type Tab = "new" | "featured" | "popular";

const WhatWeOffer = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("new");

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

  return (
    <section className="py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-primary px-4 py-3">
                <h3 className="text-sm font-bold text-primary-foreground tracking-wide">CATEGORIES</h3>
              </div>
              <ul>
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
            </div>

            {/* Brands */}
            <div className="mt-6 bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-bold text-foreground mb-4 tracking-wide">BRANDS</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Toyota", "Honda", "BMW", "Ford", "Mercedes", "Subaru"].map((brand) => (
                  <div key={brand} className="text-xs font-bold text-muted-foreground text-center py-2 border border-border rounded hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    {brand.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {/* Header with tabs */}
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

            {/* Product Grid */}
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
