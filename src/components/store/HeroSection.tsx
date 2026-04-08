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

const HERO_HEIGHT = "h-[320px] md:h-[420px] lg:h-[480px]";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="py-4">
      <div className="container">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* HERO (LEFT) */}
          <div className={`lg:col-span-2 relative rounded-lg overflow-hidden ${HERO_HEIGHT}`}>

            {slides.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt={s.title}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
                  i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-center px-6 md:px-12">
              <div className="text-white max-w-md">
                <p className="text-xs md:text-sm text-primary mb-2">
                  {slide.subtitle}
                </p>

                <h2 className="text-3xl md:text-5xl font-extrabold whitespace-pre-line">
                  {slide.title}
                </h2>

                <p className="text-sm text-gray-300 mt-3 mb-5">
                  {slide.description}
                </p>

                <Link
                  to="/shop"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded font-bold text-sm"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={() =>
                setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              <ChevronLeft className="text-white w-5 h-5" />
            </button>

            <button
              onClick={() =>
                setCurrent((prev) => (prev + 1) % slides.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              <ChevronRight className="text-white w-5 h-5" />
            </button>
          </div>

          {/* PROMOS (RIGHT - SEPARATE SECTION BUT SAME HEIGHT) */}
          <div className={`flex flex-row lg:flex-col gap-4 ${HERO_HEIGHT}`}>

            {/* Tires */}
            <div className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={promoTires}
                alt="New Tires"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">NEW OIL</p>
                <h3 className="text-lg font-extrabold text-white">NEW OIL</h3>
                <p className="text-xs text-gray-300"> Pouring the best!</p>

                <Link
                  to="/shop?category=Engines%20%26%20Components"
                  className="mt-3 border border-primary text-primary text-xs px-4 py-1 rounded w-fit"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Audio */}
            <div className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={promoAudio}
                alt="HiFi Audio"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">GET YOURS</p>
                <h3 className="text-lg font-extrabold text-white">EX-JAPAN</h3>
                <p className="text-xs text-gray-300">Get the best</p>

                <Link
                  to="/shop?category=Electrical"
                  className="mt-3 border border-primary text-primary text-xs px-4 py-1 rounded w-fit"
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