import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBundle from "@/assets/hero-bundle.jpg";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import promoTires from "@/assets/promo-tires.jpg";
import promoAudio from "@/assets/promo-audio.jpg";

const slides = [
  {
    image: heroBundle,
    subtitle: "BUY FROM US & GET YOUR",
    title: "EXCITING\nBUNDLE",
    description: "This is our most comprehensive vehicle treatment.",
  },
  {
    image: hero1,
    subtitle: "PREMIUM AUTO PARTS",
    title: "QUALITY\nPARTS",
    description: "High quality spare parts for every vehicle.",
  },
  {
    image: hero2,
    subtitle: "BEST PRICES GUARANTEED",
    title: "GREAT\nDEALS",
    description: "Fast delivery & best prices across Kenya.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="py-4">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main carousel */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
            {slides.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt={s.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
                width={1200}
                height={600}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-center px-8 md:px-12">
              <div className="text-white max-w-md">
                <p className="text-xs md:text-sm font-medium text-primary mb-2">{slide.subtitle}</p>
                <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-sm text-gray-300 mb-5">{slide.description}</p>
                <Link
                  to="/shop"
                  className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Side promo banners */}
          <div className="flex flex-row lg:flex-col gap-4">
            {/* Tires promo */}
            <div className="relative flex-1 rounded-lg overflow-hidden group cursor-pointer min-h-[140px]">
              <img
                src={promoTires}
                alt="New Tires"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={640}
                height={512}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">NEW RIMS</p>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">NEW TIRES</h3>
                <p className="text-xs text-gray-300 mt-1">Wearing the best!</p>
                <Link
                  to="/shop?category=Exterior+%26+Accessories"
                  className="mt-3 inline-block border border-primary text-primary text-xs font-semibold px-4 py-1.5 rounded hover:bg-primary hover:text-primary-foreground transition-colors w-fit"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Audio promo */}
            <div className="relative flex-1 rounded-lg overflow-hidden group cursor-pointer min-h-[140px]">
              <img
                src={promoAudio}
                alt="HiFi Audio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={640}
                height={512}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">GET YOURS</p>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">HIFI AUDIO</h3>
                <p className="text-xs text-gray-300 mt-1">Listening to the best</p>
                <Link
                  to="/shop?category=Electrical"
                  className="mt-3 inline-block border border-primary text-primary text-xs font-semibold px-4 py-1.5 rounded hover:bg-primary hover:text-primary-foreground transition-colors w-fit"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
