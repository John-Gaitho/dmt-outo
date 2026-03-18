import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import ProductCard from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "@/data/store";

const ShopPage = () => {
  const { products, searchQuery, setSearchQuery } = useStore();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("default");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Read URL params
  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";
  const year = searchParams.get("year") || "";
  const vehicleClass = searchParams.get("class") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlQuery = searchParams.get("q") || "";
  const hasVehicleFilter = !!(make || model || year || vehicleClass);

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    if (urlQuery) {
      setLocalSearch(urlQuery);
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  let filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const q = localSearch || searchQuery;
    const matchesSearch = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()) || (p.description || "").toLowerCase().includes(q.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />
      <div className="container py-6">
        {hasVehicleFilter && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-sm text-foreground">
            <span className="font-semibold">Vehicle Filter:</span>
            {make && <span className="ml-2">{make}</span>}
            {model && <span className="ml-1">{model}</span>}
            {year && <span className="ml-1">({year})</span>}
            {vehicleClass && <span className="ml-1">• {vehicleClass}</span>}
            <span className="text-muted-foreground ml-2">— Showing all compatible parts</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => { setLocalSearch(e.target.value); setSearchQuery(e.target.value); }}
                className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Categories</h3>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setSelectedCategory("")}
                    className={`text-xs w-full text-left py-1 px-2 rounded transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                    All Products ({products.length})
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.name).length;
                  return (
                    <li key={cat.name}>
                      <button onClick={() => setSelectedCategory(cat.name)}
                        className={`text-xs w-full text-left py-1 px-2 rounded transition-colors ${selectedCategory === cat.name ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                        {cat.name} ({count})
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Showing {filtered.length} products</p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-border rounded px-3 py-1.5 text-xs bg-card">
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No products found.</div>
            )}
          </div>
        </div>
      </div>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default ShopPage;
