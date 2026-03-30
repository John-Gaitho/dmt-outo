import { useStore } from "@/context/StoreContext";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

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
  const sectionProducts = products.filter((p) => p.category === category);

  return (
    <section className="py-4">
      <div className="container">
        <div
          className={`grid grid-cols-2 md:grid-cols-5 gap-0 rounded-lg overflow-hidden border border-border ${
            bgClass || ""
          }`}
        >
          {/* Left category panel */}
          <div className="bg-secondary text-secondary-foreground p-5 flex flex-col justify-between">
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

          {/* Products */}
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