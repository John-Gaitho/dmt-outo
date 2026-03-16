import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  category: string;
  subcategories?: string[];
  bgClass?: string;
}

const ProductSection = ({ title, category, subcategories, bgClass }: ProductSectionProps) => {
  const { products } = useStore();
  const sectionProducts = products.filter((p) => p.category === category);

  return (
    <section className="py-4">
      <div className="container">
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-0 rounded-lg overflow-hidden border border-border ${bgClass || ""}`}>
          <div className="bg-secondary text-secondary-foreground p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-3">{title}</h3>
              {subcategories && (
                <ul className="space-y-1.5">
                  {subcategories.map((sub) => (
                    <li key={sub} className="text-xs text-secondary-foreground/70 hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full" /> {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="text-primary text-xs font-semibold mt-4 hover:underline">View All →</button>
          </div>
          {sectionProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-card border-l border-border">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
