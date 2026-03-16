import StoreHeader from "@/components/store/StoreHeader";
import HeroSection from "@/components/store/HeroSection";
import CategorySection from "@/components/store/CategorySection";
import PromoBanners from "@/components/store/PromoBanners";
import DealsSection from "@/components/store/DealsSection";
import ProductSection from "@/components/store/ProductSection";
import StoreFooter from "@/components/store/StoreFooter";

const Index = () => (
  <div className="min-h-screen bg-background">
    <StoreHeader />
    <HeroSection />
    <CategorySection />
    <PromoBanners />
    <DealsSection />
    <ProductSection
      title="Headlights & Lighting"
      category="Headlights & Lighting"
      subcategories={["Bulbs", "Car Reflectors", "Corner Lights", "Running Lights", "Door Light"]}
    />
    <ProductSection
      title="Brakes & Rotors"
      category="Brakes & Rotors"
      subcategories={["Abs", "Accessories", "Brake Booster", "Brake Calipers", "Brake Cylinder"]}
    />
    <StoreFooter />
  </div>
);

export default Index;
