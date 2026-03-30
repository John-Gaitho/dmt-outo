import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

const DealsSection = () => {
  const { products } = useStore();
  const [dealProducts, setDealProducts] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const deals = products.filter((p) => p.deal);

    const shuffled = [...deals].sort(() => 0.5 - Math.random());

    setDealProducts(shuffled.slice(0, 2));
  }, [products]);

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Deals Of The Month
          </h2>

          <div className="flex gap-1">
            <button className="p-1.5 border border-border rounded hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button className="p-1.5 border border-border rounded hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          <div className="bg-primary rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-primary-foreground mb-1">
              Subscribe To Our Newsletter!
            </h3>

            <p className="text-sm text-primary-foreground/80 mb-4">
              Get The Latest News, Updates, And Amazing Offers
            </p>

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-secondary"
            />

            <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity w-full">
              SUBSCRIBE →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;