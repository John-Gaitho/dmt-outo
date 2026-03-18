import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import ProductCard from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const WishlistPage = () => {
  const { products, wishlist } = useStore();
  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-destructive" /> My Wishlist ({wishedProducts.length})
        </h1>
        {wishedProducts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {wishedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default WishlistPage;
