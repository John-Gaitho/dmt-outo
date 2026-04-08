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
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-star text-star" : "text-muted-foreground"}`} />
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
    <div className="bg-card border border-border rounded-lg p-3 group relative hover:shadow-md transition-shadow">
      {editing && <InlineProductEdit product={product} onClose={() => setEditing(false)} />}
      {isAdmin && (
        <button
          onClick={() => setEditing(true)}
          className="absolute top-2 right-10 z-10 p-1 rounded-full hover:bg-muted transition-colors bg-card/80"
          title="Edit product"
        >
          <Pencil className="w-4 h-4 text-primary" />
        </button>
      )}
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

      <Link to={`/product/${product.id}`}>
        <div className="aspect-square mb-3 flex items-center justify-center overflow-hidden cursor-pointer">
          <img src={displayImage} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" />
        </div>
      </Link>

      <div className="space-y-1">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">KSH {product.originalPrice.toLocaleString()}</span>
            )}
            <span className="text-sm font-bold text-foreground">KSH {product.price.toLocaleString()}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Contact for price</p>
        )}
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-foreground font-medium line-clamp-2 leading-tight hover:text-primary transition-colors">{product.name}</p>
        </Link>
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
