import StoreHeader from "@/components/store/StoreHeader";
import HeroSection from "@/components/store/HeroSection";
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
    <WhatWeOffer />
    <PremiumBanner />
    <DealsSection />

    <ProductSection
      title="Headlights & Lighting"
      category="Headlights & Lighting"
      subcategories={[
        { name: "Bulbs", link: "/category/headlights/bulbs" },
        { name: "Car Reflectors", link: "/category/headlights/reflectors" },
        { name: "Corner Lights", link: "/category/headlights/corner-lights" },
        { name: "Running Lights", link: "/category/headlights/running-lights" },
        { name: "Door Light", link: "/category/headlights/door-light" },
      ]}
    />

    <ProductSection
      title="Brakes & Rotors"
      category="Brakes & Rotors"
      subcategories={[
        { name: "ABS", link: "/category/brakes/abs" },
        { name: "Accessories", link: "/category/brakes/accessories" },
        { name: "Brake Booster", link: "/category/brakes/booster" },
        { name: "Brake Calipers", link: "/category/brakes/calipers" },
        { name: "Brake Cylinder", link: "/category/brakes/cylinder" },
      ]}
    />

    <ProductSection
      title="Engines & Components"
      category="Engines & Components"
      subcategories={[
        { name: "Engine Oil", link: "/category/engine/oil" },
        { name: "Filters", link: "/category/engine/filters" },
        { name: "Gaskets", link: "/category/engine/gaskets" },
        { name: "Pistons", link: "/category/engine/pistons" },
        { name: "Timing Belts", link: "/category/engine/timing-belts" },
      ]}
    />

    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default Index;
