import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface Subcategory {
  name: string;
  link: string;
}

interface ProductSectionProps {
  title: string;
  category: string;
  subcategories?: Subcategory[];
  bgClass?: string;
}

const ProductSection = ({ title, category, subcategories, bgClass }: ProductSectionProps) => {
  const { products } = useStore();
  const isMobile = useIsMobile();
  const sectionProducts = products.filter((p) => p.category === category);
  const displayProducts = sectionProducts.slice(0, isMobile ? 4 : 4);

  return (
    <section className="py-3 md:py-4">
      <div className="container px-3 md:px-4">

        {/* MOBILE CATEGORY HEADER */}
        <div className="bg-secondary text-secondary-foreground p-3 md:p-4 mb-2 md:mb-3 rounded-xl md:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">{title}</h3>
            <Link
              to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-primary text-[10px] font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          {subcategories && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.link}
                  to={sub.link}
                  className="text-[10px] text-secondary-foreground/70 hover:text-primary bg-secondary-foreground/5 px-2 py-0.5 rounded-full transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* GRID */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-0 rounded-xl md:rounded-lg overflow-hidden border border-border ${bgClass || ""}`}>
          
          {/* DESKTOP CATEGORY PANEL */}
          <div className="hidden md:flex bg-secondary text-secondary-foreground p-5 flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-3">{title}</h3>
              {subcategories && (
                <ul className="space-y-1.5">
                  {subcategories.map((sub) => (
                    <li key={sub.link}>
                      <Link to={sub.link} className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Link to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`} className="text-primary text-xs font-semibold mt-4 hover:underline">
              View All →
            </Link>
          </div>

          {/* PRODUCTS */}
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className={`bg-card border border-border rounded-lg md:rounded-none md:border-0 ${index !== 0 ? "md:border-l" : ""}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
