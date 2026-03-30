import { useParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/store/ProductCard";

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const { products } = useStore();

  const filteredProducts = products.filter((p) => {
    if (subcategory) {
      return (
        p.category.toLowerCase().replace(/\s+/g, "-") === category &&
        p.subcategory?.toLowerCase().replace(/\s+/g, "-") === subcategory
      );
    }

    return p.category.toLowerCase().replace(/\s+/g, "-") === category;
  });

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {subcategory || category}
      </h1>

      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;