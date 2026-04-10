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

const ProductSection = ({
  title,
  category,
  subcategories,
  bgClass
}: ProductSectionProps) => {
  const { products } = useStore();
  const isMobile = useIsMobile();

  const sectionProducts = products.filter((p) => p.category === category);

  // ✅ Show 6 on mobile (so it forms 2 rows of 3 nicely)
  const displayProducts = sectionProducts.slice(0, isMobile ? 6 : 4);

  return (
    <section className="py-4">
      <div className="container">


        {/* 🔹 MOBILE CATEGORY PANEL */}
        <div className="bg-secondary text-secondary-foreground p-4 mb-3 rounded-lg md:hidden">
          <h3 className="text-base font-bold mb-2">{title}</h3>

          {subcategories && (
            <ul className="space-y-1">
              {subcategories.map((sub) => (
                <li key={sub.link}>
                  <Link
                    to={sub.link}
                    className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-primary text-xs font-semibold mt-3 inline-block hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* 🔹 GRID */}
        <div
          className={`
            grid 
            grid-cols-3 
            md:grid-cols-5 
            gap-3 md:gap-0 
            rounded-lg 
            overflow-hidden 
            border border-border 
            ${bgClass || ""}
          `}
        >
          {/* 🔹 DESKTOP CATEGORY PANEL */}
          <div className="hidden md:flex bg-secondary text-secondary-foreground p-5 flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-3">{title}</h3>

              {subcategories && (
                <ul className="space-y-1.5">
                  {subcategories.map((sub) => (
                    <li key={sub.link}>
                      <Link
                        to={sub.link}
                        className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-primary text-xs font-semibold mt-4 hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* 🔹 PRODUCTS */}
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className={`
                bg-card 
                border 
                border-border 
                rounded-md 
                md:rounded-none 
                md:border-0 
                md:${index !== 0 ? "border-l" : ""}
              `}
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