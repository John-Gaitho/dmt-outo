import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import ReturnsPage from "./pages/ReturnsPage.tsx";
import ShippingPage from "./pages/ShippingPage.tsx";
import WarrantyPage from "./pages/WarrantyPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import WhatsAppButton from "@/components/WhatsAppButton";
import LiveChat from "@/components/LiveChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WhatsAppButton />
            <LiveChat />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
