import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const { isAdmin } = useAuth();
  const product = products.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold">Back to Shop</Link>
        </div>
        <StoreFooter />
        <MobileBottomNav />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isWished = wishlist.includes(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />
      <div className="container py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative bg-card border border-border rounded-lg aspect-square flex items-center justify-center overflow-hidden">
              <img src={images[selectedImageIndex]} alt={product.name} className="max-h-full max-w-full object-contain p-4" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 border border-border rounded-full p-1.5 hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 border border-border rounded-full p-1.5 hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {product.discount && (
                <span className="absolute top-3 left-3 bg-sale-badge text-sale-badge-foreground text-xs font-bold px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden ${i === selectedImageIndex ? "border-primary ring-1 ring-primary" : "border-border"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}</p>
              <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? "fill-star text-star" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {isAdmin ? (
              <div className="flex items-baseline gap-3">
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through">KSH {product.originalPrice.toLocaleString()}</span>
                )}
                <span className="text-2xl font-bold text-foreground">KSH {product.price.toLocaleString()}</span>
              </div>
            ) : (
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-sm font-medium text-muted-foreground">Contact us for pricing</p>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${product.inStock ? "text-success" : "text-destructive"}`}>
                {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 hover:bg-muted transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-2 hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 border rounded-md transition-colors ${isWished ? "border-sale-badge bg-sale-badge/10" : "border-border hover:bg-muted"}`}
              >
                <Heart className={`w-4 h-4 ${isWished ? "fill-sale-badge text-sale-badge" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-foreground mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default ProductDetailPage;
