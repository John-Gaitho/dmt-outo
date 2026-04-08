import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import ProductCard from "@/components/store/ProductCard";
import StickyContactBar from "@/components/store/StickyContactBar";

import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Phone,
  MessageCircle,
  MapPin
} from "lucide-react";

const PHONE = "254718634116";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { products, addToCart, toggleWishlist, wishlist } =
    useStore();

  const { isAdmin } = useAuth();

  const product = products.find(p => p.id === id);

  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />

        <div className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Product not found
          </p>

          <Link
            to="/shop"
            className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold"
          >
            Back to Shop
          </Link>
        </div>

        <StoreFooter />
        <MobileBottomNav />
      </div>
    );
  }

  /* ---------- Derived Values ---------- */

  const images =
    product.images?.length
      ? product.images
      : [product.image];

  const isWished =
    wishlist.includes(product.id);

  const relatedProducts = products
    .filter(
      p =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  const whatsappURL =
    `https://wa.me/${PHONE}?text=` +
    encodeURIComponent(
      `Hello, I'm interested in ${product.name}`
    );

  /* ---------- Helper Functions ---------- */

  const changeImage = (dir: number) => {
    setImageIndex(i =>
      (i + dir + images.length) % images.length
    );
  };

  const addMultipleToCart = () => {
    for (let i = 0; i < quantity; i++)
      addToCart(product);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">

      <StoreHeader />

      <div className="container py-4 md:py-6">

        {/* Breadcrumb */}

        <div className="text-xs text-muted-foreground mb-4 flex gap-2">
          <Link to="/">Home</Link>
          /
          <Link to="/shop">Shop</Link>
          /
          <span>{product.category}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* ---------- Image Section ---------- */}

          <div>

            <div className="relative bg-card border rounded-lg aspect-square flex items-center justify-center">

              <img
                src={images[imageIndex]}
                alt={product.name}
                className="max-h-full object-contain p-4"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => changeImage(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 border rounded-full bg-card"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => changeImage(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 border rounded-full bg-card"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {product.discount && (
                <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-sale-badge text-white">
                  -{product.discount}%
                </span>
              )}

            </div>

            {/* Thumbnails */}

            {images.length > 1 && (

              <div className="flex gap-2 mt-2 overflow-x-auto">

                {images.map((img, i) => (

                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-16 h-16 border rounded ${
                      i === imageIndex
                        ? "border-primary"
                        : ""
                    }`}
                  >

                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />

                  </button>

                ))}

              </div>

            )}

          </div>

          {/* ---------- Product Info ---------- */}

          <div className="space-y-4">

            <div>

              <p className="text-xs text-muted-foreground">
                {product.category}
                {product.subcategory &&
                  ` / ${product.subcategory}`}
              </p>

              <h1 className="text-xl font-bold">
                {product.name}
              </h1>

            </div>

            {/* Rating */}

            <div className="flex items-center gap-2 text-sm">

              <div className="flex">
                {Array.from({ length: 5 }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? "fill-star text-star"
                          : "text-muted-foreground"
                      }`}
                    />
                  )
                )}
              </div>

              ({product.reviews} reviews)

            </div>

            {/* Price */}

            {isAdmin ? (
              <div className="text-2xl font-bold">
                KSH {product.price.toLocaleString()}
              </div>
            ) : (
              <div className="bg-muted p-3 rounded text-sm">
                Contact us for pricing
              </div>
            )}

            {/* Description */}

            {product.description && (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Stock */}

            <p
              className={`text-sm font-medium ${
                product.inStock
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {product.inStock
                ? "✓ In Stock"
                : "✗ Out of Stock"}
            </p>

            {/* Quantity */}

            <div className="flex gap-3">

              <div className="flex border rounded">

                <button
                  onClick={() =>
                    setQuantity(q =>
                      Math.max(1, q - 1)
                    )
                  }
                  className="p-2"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="px-4 flex items-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(q => q + 1)
                  }
                  className="p-2"
                >
                  <Plus className="w-4 h-4" />
                </button>

              </div>

              <button
                onClick={addMultipleToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-white rounded px-4 flex items-center justify-center gap-2"
              >

                <ShoppingCart className="w-4 h-4" />

                Add to Cart

              </button>

              <button
                onClick={() =>
                  toggleWishlist(product.id)
                }
                className="p-2 border rounded"
              >

                <Heart
                  className={`w-4 h-4 ${
                    isWished
                      ? "fill-sale-badge text-sale-badge"
                      : ""
                  }`}
                />

              </button>

            </div>

            {/* Contact Box */}

            <div className="border rounded-lg p-4 space-y-2 text-sm">

              <h3 className="font-semibold">
                Contact Us
              </h3>

              <a
                href={`tel:+${PHONE}`}
                className="flex gap-2 items-center"
              >
                <Phone className="w-4 h-4" />
                +254 718 634 116
              </a>

              <a
                href={whatsappURL}
                target="_blank"
                className="flex gap-2 items-center"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp Us
              </a>

              <div className="flex gap-2 items-center text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Ol Kalou Town
              </div>

            </div>

            {/* Features */}

            <div className="grid grid-cols-3 text-center text-xs pt-4 border-t">

              <div>
                <Truck className="mx-auto w-5 h-5 text-primary" />
                Free Delivery
              </div>

              <div>
                <Shield className="mx-auto w-5 h-5 text-primary" />
                Warranty
              </div>

              <div>
                <RotateCcw className="mx-auto w-5 h-5 text-primary" />
                Returns
              </div>

            </div>

          </div>

        </div>

        {/* Related Products */}

        {relatedProducts.length > 0 && (

          <div className="mt-10">

            <h2 className="font-bold mb-4">
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}

            </div>

          </div>

        )}

      </div>

      <StoreFooter />
      <MobileBottomNav />

      <StickyContactBar
        productName={product.name}
      />

    </div>
  );
};

export default ProductDetailPage;