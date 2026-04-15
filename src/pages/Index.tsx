import StoreHeader from "@/components/store/StoreHeader";
import HeroSection from "@/components/store/HeroSection";
import FloatingProducts from "@/components/store/FloatingProducts";
import WhatWeOffer from "@/components/store/WhatWeOffer";
import PremiumBanner from "@/components/store/PremiumBanner";
import DealsSection from "@/components/store/DealsSection";
import ProductSection from "@/components/store/ProductSection";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";

const Index = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <HeroSection />
    <FloatingProducts />
    <WhatWeOffer />
    <PremiumBanner />
    <DealsSection />

    <ProductSection
      title="Headlights & Lighting"
      category="Headlights & Lighting"
      subcategories={[
        { name: "Bulbs", link: "/shop?category=Headlights%20%26%20Lighting&q=bulbs" },
        { name: "Car Reflectors", link: "/shop?category=Headlights%20%26%20Lighting&q=reflectors" },
        { name: "Corner Lights", link: "/shop?category=Headlights%20%26%20Lighting&q=corner%20lights" },
        { name: "Running Lights", link: "/shop?category=Headlights%20%26%20Lighting&q=running%20lights" },
        { name: "Door Light", link: "/shop?category=Headlights%20%26%20Lighting&q=door%20light" },
      ]}
    />

    <ProductSection
      title="Brakes & Rotors"
      category="Brakes & Rotors"
      subcategories={[
        { name: "ABS", link: "/shop?category=Brakes%20%26%20Rotors&q=abs" },
        { name: "Accessories", link: "/shop?category=Brakes%20%26%20Rotors&q=accessories" },
        { name: "Brake Booster", link: "/shop?category=Brakes%20%26%20Rotors&q=booster" },
        { name: "Brake Calipers", link: "/shop?category=Brakes%20%26%20Rotors&q=calipers" },
        { name: "Brake Cylinder", link: "/shop?category=Brakes%20%26%20Rotors&q=cylinder" },
      ]}
    />

    <ProductSection
      title="Engines & Components"
      category="Engines & Components"
      subcategories={[
        { name: "Engine Oil", link: "/shop?category=Engines%20%26%20Components&q=oil" },
        { name: "Filters", link: "/shop?category=Engines%20%26%20Components&q=filters" },
        { name: "Gaskets", link: "/shop?category=Engines%20%26%20Components&q=gaskets" },
        { name: "Pistons", link: "/shop?category=Engines%20%26%20Components&q=pistons" },
        { name: "Timing Belts", link: "/shop?category=Engines%20%26%20Components&q=timing%20belts" },
      ]}
    />

    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default Index;
