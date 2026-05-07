import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FAQPage from "./pages/FAQPage";
import WishlistPage from "./pages/WishlistPage";
import ReturnsPage from "./pages/ReturnsPage";
import ShippingPage from "./pages/ShippingPage";
import WarrantyPage from "./pages/WarrantyPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";

import WhatsAppButton from "@/components/WhatsAppButton";
import LiveChat from "@/components/LiveChat";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <StoreProvider>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <ScrollToTop />


                {/* Global Floating Components */}
                <WhatsAppButton />
                <LiveChat />

                {/* Notifications */}
                <Toaster />
                <Sonner />

                {/* Routes */}
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Info Pages */}
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/warranty" element={<WarrantyPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Category Routes */}
                  <Route
                    path="/category/:category/:subcategory"
                    element={<CategoryPage />}
                  />
                  <Route
                    path="/category/:category"
                    element={<CategoryPage />}
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </StoreProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;