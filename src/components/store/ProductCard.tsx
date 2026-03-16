import { Heart, ShoppingCart, Star } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/store";

interface ProductCardProps {
  product: Product;
  showCountdown?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-star text-star" : "text-muted-foreground"}`} />
    ))}
  </div>
);

const ProductCard = ({ product, showCountdown }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWished = wishlist.includes(product.id);

  return (
    <div className="bg-card border border-border rounded-lg p-3 group relative hover:shadow-md transition-shadow">
      {product.discount && (
        <span className="absolute top-2 left-2 bg-sale-badge text-sale-badge-foreground text-[10px] font-bold px-2 py-0.5 rounded z-10">
          -{product.discount}%
        </span>
      )}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <Heart className={`w-4 h-4 ${isWished ? "fill-sale-badge text-sale-badge" : "text-muted-foreground"}`} />
      </button>

      <div className="aspect-square mb-3 flex items-center justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
          )}
          <span className="text-sm font-bold text-foreground">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-foreground font-medium line-clamp-2 leading-tight">{product.name}</p>
        <p className="text-[10px] text-muted-foreground">{product.category}</p>
        <StarRating rating={product.rating} />

        {showCountdown && (
          <div className="pt-2">
            <p className="text-[10px] text-muted-foreground mb-1">Sale Ends In</p>
            <div className="flex gap-1">
              {[{ v: "127", l: "DAYS" }, { v: "15", l: "HOURS" }, { v: "59", l: "MIN" }, { v: "51", l: "SEC" }].map((t) => (
                <div key={t.l} className="bg-primary text-primary-foreground text-center rounded px-1.5 py-1">
                  <div className="text-xs font-bold">{t.v}</div>
                  <div className="text-[8px]">{t.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-2 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
