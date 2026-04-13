import { Heart, ShoppingCart, Star, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/data/store";
import InlineProductEdit from "./InlineProductEdit";

interface ProductCardProps {
  product: Product;
  showCountdown?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < rating ? "fill-star text-star" : "text-muted-foreground"}`} />
    ))}
  </div>
);

const ProductCard = ({ product, showCountdown }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { isAdmin } = useAuth();
  const isWished = wishlist.includes(product.id);
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl md:rounded-lg p-2 md:p-3 group relative hover:shadow-md transition-shadow">
      {editing && <InlineProductEdit product={product} onClose={() => setEditing(false)} />}
      {isAdmin && (
        <button
          onClick={() => setEditing(true)}
          className="absolute top-1.5 right-8 md:top-2 md:right-10 z-10 p-1 rounded-full hover:bg-muted transition-colors bg-card/80"
          title="Edit product"
        >
          <Pencil className="w-3 h-3 md:w-4 md:h-4 text-primary" />
        </button>
      )}
      {product.discount && (
        <span className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-sale-badge text-sale-badge-foreground text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded z-10">
          -{product.discount}%
        </span>
      )}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-10 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isWished ? "fill-sale-badge text-sale-badge" : "text-muted-foreground"}`} />
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="aspect-square mb-2 md:mb-3 flex items-center justify-center overflow-hidden cursor-pointer">
          <img src={displayImage} alt={product.name} loading="lazy" decoding="async" width={300} height={300} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" />
        </div>
      </Link>

      <div className="space-y-0.5 md:space-y-1">
        {isAdmin ? (
          <div className="flex items-center gap-1.5 md:gap-2">
            {product.originalPrice && (
              <span className="text-[10px] md:text-xs text-muted-foreground line-through">KSH {product.originalPrice.toLocaleString()}</span>
            )}
            <span className="text-xs md:text-sm font-bold text-foreground">KSH {product.price.toLocaleString()}</span>
          </div>
        ) : (
          <p className="text-[10px] md:text-xs text-muted-foreground italic">Contact for price</p>
        )}
        <Link to={`/product/${product.id}`}>
          <p className="text-[10px] md:text-xs text-foreground font-medium line-clamp-2 leading-tight hover:text-primary transition-colors">{product.name}</p>
        </Link>
        <p className="text-[9px] md:text-[10px] text-muted-foreground">{product.category}</p>
        <StarRating rating={product.rating} />

        {showCountdown && (
          <div className="pt-1 md:pt-2">
            <p className="text-[9px] md:text-[10px] text-muted-foreground mb-1">Sale Ends In</p>
            <div className="flex gap-0.5 md:gap-1">
              {[{ v: "127", l: "DAYS" }, { v: "15", l: "HRS" }, { v: "59", l: "MIN" }, { v: "51", l: "SEC" }].map((t) => (
                <div key={t.l} className="bg-primary text-primary-foreground text-center rounded px-1 md:px-1.5 py-0.5 md:py-1">
                  <div className="text-[9px] md:text-xs font-bold">{t.v}</div>
                  <div className="text-[7px] md:text-[8px]">{t.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-1.5 md:mt-2 bg-primary text-primary-foreground text-[10px] md:text-xs font-semibold py-1.5 md:py-2 rounded-lg md:rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
