import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  Product,
  CartItem,
  Order,
  sampleOrders,
} from "@/data/store";

import { api } from "@/lib/api";

/* ----------------------------- */
/* TYPES */
/* ----------------------------- */

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
  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => void;

  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;

  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext =
  createContext<StoreContextType | undefined>(undefined);

/* ----------------------------- */
/* MAP DATABASE → PRODUCT */
/* ----------------------------- */

const mapDbProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),

  originalPrice: row.original_price
    ? Number(row.original_price)
    : undefined,

  category: row.category,
  subcategory: row.subcategory || undefined,

  image: row.images?.[0] || "",
  images: row.images || [],

  rating: Number(row.rating) || 0,
  reviews: row.reviews || 0,

  inStock: row.in_stock,
  featured: row.featured,
  deal: row.deal,

  discount: row.discount || undefined,
  description: row.description || undefined,

  stockQuantity: row.stock_quantity ?? 100,
});

/* ----------------------------- */
/* PROVIDER */
/* ----------------------------- */

export const StoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [wishlist, setWishlist] =
    useState<string[]>([]);

  const [orders, setOrders] =
    useState<Order[]>(sampleOrders);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {

    try {

      setProductsLoading(true);

      const data =
        await api.getProducts();

      setProducts(
        data.map(mapDbProduct)
      );

      console.log(
        "STORE PRODUCTS:",
        data
      );

    } catch (error) {

      console.error(
        "Failed to fetch products:",
        error
      );

    } finally {

      setProductsLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  /* =========================
     CART
  ========================= */

  const addToCart = (
    product: Product
  ) => {

    setCart((prev) => {

      const existing =
        prev.find(
          (item) =>
            item.product.id === product.id
        );

      if (existing) {

        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
        },
      ];

    });

  };

  const removeFromCart = (
    productId: string
  ) => {

    setCart((prev) =>
      prev.filter(
        (item) =>
          item.product.id !== productId
      )
    );

  };

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {

    if (quantity <= 0) {

      removeFromCart(productId);

      return;

    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );

  };

  const clearCart = () =>
    setCart([]);

  const cartTotal =
    cart.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );

  const cartCount =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  /* =========================
     PRODUCT CRUD
  ========================= */

  const addProduct = async (
    product: Product
  ) => {

    try {

      await api.createProduct(product);

      await fetchProducts();

    } catch (error) {

      console.error(
        "Failed to add product:",
        error
      );

    }

  };

  const updateProduct = async (
    product: Product
  ) => {

    try {

      await api.updateProduct(
        product.id,
        product
      );

      await fetchProducts();

    } catch (error) {

      console.error(
        "Failed to update product:",
        error
      );

    }

  };

  const deleteProduct = async (
    productId: string
  ) => {

    try {

      await api.deleteProduct(
        productId
      );

      await fetchProducts();

    } catch (error) {

      console.error(
        "Failed to delete product:",
        error
      );

    }

  };

  /* ========================= */

  return (

    <StoreContext.Provider
      value={{

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        cartTotal,
        cartCount,

        wishlist,
        toggleWishlist:
          (productId: string) =>
            setWishlist((prev) =>
              prev.includes(productId)
                ? prev.filter(
                    (id) =>
                      id !== productId
                  )
                : [...prev, productId]
            ),

        orders,
        addOrder:
          (order: Order) =>
            setOrders((prev) => [
              order,
              ...prev,
            ]),

        updateOrderStatus:
          (orderId, status) =>
            setOrders((prev) =>
              prev.map((order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status,
                    }
                  : order
              )
            ),

        products,
        productsLoading,
        refreshProducts:
          fetchProducts,

        addProduct,
        updateProduct,
        deleteProduct,

        searchQuery,
        setSearchQuery,

      }}
    >

      {children}

    </StoreContext.Provider>

  );

};

/* ----------------------------- */
/* HOOK */
/* ----------------------------- */

export const useStore = () => {

  const context =
    useContext(StoreContext);

  if (!context) {

    throw new Error(
      "useStore must be used within StoreProvider"
    );

  }

  return context;

};