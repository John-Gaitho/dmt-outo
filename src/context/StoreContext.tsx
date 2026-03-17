import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, sampleOrders } from "@/data/store";
import { supabase } from "@/integrations/supabase/client";

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const mapDbProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  category: row.category,
  subcategory: row.subcategory || undefined,
  image: row.images?.[0] || "",
  images: row.images || [],
  rating: Number(row.rating),
  reviews: row.reviews,
  inStock: row.in_stock,
  featured: row.featured,
  deal: row.deal,
  discount: row.discount || undefined,
  description: row.description || undefined,
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data) {
      setProducts(data.map(mapDbProduct));
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const addProduct = async (product: Product) => {
    const { error } = await supabase.from("products").insert({
      name: product.name,
      price: product.price,
      original_price: product.originalPrice || null,
      category: product.category,
      subcategory: product.subcategory || null,
      images: product.images || [],
      rating: product.rating,
      reviews: product.reviews,
      in_stock: product.inStock,
      featured: product.featured || false,
      deal: product.deal || false,
      discount: product.discount || null,
      description: product.description || null,
    });
    if (!error) await fetchProducts();
  };

  const updateProduct = async (product: Product) => {
    const { error } = await supabase.from("products").update({
      name: product.name,
      price: product.price,
      original_price: product.originalPrice || null,
      category: product.category,
      subcategory: product.subcategory || null,
      images: product.images || [],
      rating: product.rating,
      reviews: product.reviews,
      in_stock: product.inStock,
      featured: product.featured || false,
      deal: product.deal || false,
      discount: product.discount || null,
      description: product.description || null,
    }).eq("id", product.id);
    if (!error) await fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (!error) await fetchProducts();
  };

  return (
    <StoreContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
        wishlist, toggleWishlist,
        orders, addOrder, updateOrderStatus,
        products, productsLoading, refreshProducts: fetchProducts,
        addProduct, updateProduct, deleteProduct,
        searchQuery, setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};