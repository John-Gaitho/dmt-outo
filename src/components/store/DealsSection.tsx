import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

const DealsSection = () => {
  const { products } = useStore();
  const [dealProducts, setDealProducts] = useState<typeof products>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const instockProducts = products.filter((p) => p.inStock);
    const shuffled = [...instockProducts].sort(() => 0.5 - Math.random());
    setDealProducts(shuffled.slice(0, 2));
  }, [products]);

  console.log(dealProducts);
  console.log(products[0]);


  return (
    <section className="py-5 md:py-8">
      <div className="container px-3 md:px-4">
        <h2 className="text-base md:text-xl font-bold text-foreground mb-3 md:mb-4">
          Deals Of The Month
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Newsletter — full width on mobile, fits grid on desktop */}
          <div className="col-span-2 md:col-span-1 bg-primary rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm md:text-lg font-bold text-primary-foreground mb-1">
              Subscribe To Newsletter!
            </h3>
            <p className="text-[11px] md:text-sm text-primary-foreground/80 mb-3 md:mb-4">
              Get news, updates, and offers
            </p>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs md:text-sm mb-2 md:mb-3 focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity w-full">
              SUBSCRIBE →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
