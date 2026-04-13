import { Link } from "react-router-dom";
import premiumInterior from "@/assets/premium-interior.jpg";

const PremiumBanner = () => (
  <section className="py-3 md:py-6">
    <div className="container px-3 md:px-4">
      <div className="relative rounded-2xl md:rounded-lg overflow-hidden h-[140px] md:h-[220px]">
        <img
          src={premiumInterior}
          alt="Premium Interior"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1400}
          height={512}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/20" />
        <div className="absolute inset-0 flex items-center px-5 md:px-12">
          <div className="text-white">
            <p className="text-[10px] md:text-sm text-primary font-medium mb-0.5 md:mb-1">INTERIOR ITEMS FOR</p>
            <h3 className="text-lg md:text-4xl font-extrabold mb-2 md:mb-3">
              PREMIUM <span className="text-primary">CLASS</span>
            </h3>
            <Link
              to="/shop"
              className="inline-block border border-white text-white text-[10px] md:text-xs font-semibold px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PremiumBanner;
