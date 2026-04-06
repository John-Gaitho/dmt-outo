import { Link } from "react-router-dom";
import premiumInterior from "@/assets/premium-interior.jpg";

const PremiumBanner = () => (
  <section className="py-6">
    <div className="container">
      <div className="relative rounded-lg overflow-hidden h-[180px] md:h-[220px]">
        <img
          src={premiumInterior}
          alt="Premium Interior"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1400}
          height={512}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="text-white">
            <p className="text-xs md:text-sm text-primary font-medium mb-1">INTERIOR ITEMS FOR</p>
            <h3 className="text-2xl md:text-4xl font-extrabold mb-3">
              PREMIUM <span className="text-primary">CLASS</span>
            </h3>
            <Link
              to="/shop"
              className="inline-block border border-white text-white text-xs font-semibold px-5 py-2 rounded hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
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
