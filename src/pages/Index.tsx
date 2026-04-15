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

    {/* HEADLIGHTS */}
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

    {/* BRAKES */}
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

    {/* ENGINE */}
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

    {/* NEW — AIR & FUEL DELIVERY */}
    <ProductSection
      title="Air & Fuel Delivery"
      category="Air & Fuel Delivery"
      subcategories={[
        { name: "Fuel Pumps", link: "/shop?category=Air%20%26%20Fuel%20Delivery&q=fuel%20pump" },
        { name: "Fuel Injectors", link: "/shop?category=Air%20%26%20Fuel%20Delivery&q=injector" },
        { name: "Air Filters", link: "/shop?category=Air%20%26%20Fuel%20Delivery&q=air%20filter" },
        { name: "Throttle Bodies", link: "/shop?category=Air%20%26%20Fuel%20Delivery&q=throttle" },
        { name: "Mass Air Flow", link: "/shop?category=Air%20%26%20Fuel%20Delivery&q=maf" },
      ]}
    />

    {/* NEW — ELECTRICAL */}
    <ProductSection
      title="Electrical"
      category="Electrical"
      subcategories={[
        { name: "Batteries", link: "/shop?category=Electrical&q=battery" },
        { name: "Alternators", link: "/shop?category=Electrical&q=alternator" },
        { name: "Starters", link: "/shop?category=Electrical&q=starter" },
        { name: "Ignition Coils", link: "/shop?category=Electrical&q=coil" },
        { name: "Sensors", link: "/shop?category=Electrical&q=sensor" },
      ]}
    />

    {/* NEW — SUSPENSION */}
    <ProductSection
      title="Suspension"
      category="Suspension"
      subcategories={[
        { name: "Shock Absorbers", link: "/shop?category=Suspension&q=shock" },
        { name: "Struts", link: "/shop?category=Suspension&q=struts" },
        { name: "Control Arms", link: "/shop?category=Suspension&q=control%20arm" },
        { name: "Ball Joints", link: "/shop?category=Suspension&q=ball%20joint" },
        { name: "Bushings", link: "/shop?category=Suspension&q=bushing" },
      ]}
    />

    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default Index;