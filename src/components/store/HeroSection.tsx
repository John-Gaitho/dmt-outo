import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const recommendedParts = [
  { name: "Brake Pads", price: "From KSh 1,500" },
  { name: "Shock Absorber", price: " From KSh 3,500" },
  { name: "Engine Oil 5W-30", price: "From KSh 3,000" },
];

const locations = ["Nairobi", "Olkalou", "Nakuru"];

const HERO_HEIGHT = "h-[300px] sm:h-[360px] md:h-[420px] lg:h-[500px]";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const [location, setLocation] = useState("your area");
  const [stock, setStock] = useState(5);
  const [partIndex, setPartIndex] = useState(0);

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto slide
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, isMobile ? 3500 : 5000);
    return () => clearInterval(timer);
  }, [paused, isMobile]);

  // Geo
  useEffect(() => {
    const city = locations[Math.floor(Math.random() * locations.length)];
    setLocation(city);
  }, []);

  // Stock
  useEffect(() => {
    const timer = setInterval(() => {
      setStock((prev) => (prev > 1 ? prev - 1 : 5));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // AI rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setPartIndex((prev) => (prev + 1) % recommendedParts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) paginate(1);
    if (diff < -50) paginate(-1);
  };

  // 3D tilt
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRotate({
      x: -(y - rect.height / 2) / 20,
      y: (x - rect.width / 2) / 20,
    });
  };

  // Magnet
  const handleMagnet = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMagnet({ x: x * 0.3, y: y * 0.3 });
  };

  const paginate = (dir) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="py-4">
      <div className="container">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* HERO */}
          <div
            className={`lg:col-span-2 relative rounded-xl overflow-hidden ${HERO_HEIGHT}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* IMAGE */}
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={slide.image}
                initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* CONTENT */}
            <motion.div
              onMouseMove={handleMouseMove}
              animate={!isMobile ? { rotateX: rotate.x, rotateY: rotate.y } : {}}
              className="absolute inset-0 flex items-center px-4 md:px-12 z-10"
            >
              <div className="text-white max-w-md">

                <p className="text-xs md:text-sm text-primary mb-2">
                  {slide.subtitle}
                </p>

                <h2 className="text-2xl md:text-5xl font-extrabold whitespace-pre-line">
                  {slide.title}
                </h2>

                <p className="text-xs md:text-sm text-gray-300 mt-2">
                  {slide.description}
                </p>

                {/* AI */}
                <div className="mt-3 text-xs bg-white/10 px-3 py-2 rounded">
                  🔥 {recommendedParts[partIndex].name} — {recommendedParts[partIndex].price}
                </div>

                {/* GEO + STOCK */}
                <p className="text-xs text-yellow-400 mt-2">
                  🚚 Fast delivery in {location}
                </p>
                <p className="text-xs text-red-400">
                  ⚡ Only {stock} left
                </p>

                {/* CTA */}
                <motion.div
                  onMouseMove={handleMagnet}
                  animate={!isMobile ? { x: magnet.x, y: magnet.y } : {}}
                  className="mt-4"
                >
                  <Link
                    to="/shop"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm w-full md:w-auto block text-center"
                  >
                    SHOP NOW
                  </Link>
                </motion.div>

              </div>
            </motion.div>

            {/* CONTROLS */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              <ChevronLeft className="text-white w-5 h-5" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              <ChevronRight className="text-white w-5 h-5" />
            </button>
          </div>

          {/* PROMOS (RIGHT) — HIDDEN ON MOBILE */}
          <div className={`hidden lg:flex flex-col gap-4 ${HERO_HEIGHT}`}>

            {/* Tires */}
            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={promoTires}
                alt="Premium engine oil products at DMT Spares"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">NEW OIL</p>
                <h3 className="text-lg font-extrabold text-white">NEW OIL</h3>
                <p className="text-xs text-gray-300">Pouring the best!</p>

                <Link
                  to="/shop?category=Engines%20%26%20Components"
                  className="mt-3 border border-primary text-primary text-xs px-4 py-1 rounded w-fit"
                >
                  View Details
                </Link>
              </div>
            </motion.div>

            {/* Audio */}
            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={promoAudio}
                alt="Ex-Japan auto parts available at DMT Spares"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;