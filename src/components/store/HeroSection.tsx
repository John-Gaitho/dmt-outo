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
  { name: "Shock Absorber", price: "From KSh 3,500" },
  { name: "Engine Oil 5W-30", price: "From KSh 3,000" },
];

const locations = ["Nairobi", "Olkalou", "Nakuru"];

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, isMobile ? 3500 : 5000);
    return () => clearInterval(timer);
  }, [paused, isMobile]);

  useEffect(() => {
    setLocation(locations[Math.floor(Math.random() * locations.length)]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setStock((p) => (p > 1 ? p - 1 : 5)), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setPartIndex((p) => (p + 1) % recommendedParts.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) paginate(1);
    if (diff < -50) paginate(-1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRotate({
      x: -(e.clientY - rect.top - rect.height / 2) / 20,
      y: (e.clientX - rect.left - rect.width / 2) / 20,
    });
  };

  const handleMagnet = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnet({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  };

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="py-2 md:py-4">
      <div className="container px-3 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

          {/* HERO SLIDER */}
          <div
            className="lg:col-span-2 relative rounded-2xl md:rounded-xl overflow-hidden h-[260px] sm:h-[320px] md:h-[420px] lg:h-[500px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={slide.image}
                initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={slide.title.replace("\n", " ")}
              />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            {/* Content */}
            <motion.div
              onMouseMove={handleMouseMove}
              animate={!isMobile ? { rotateX: rotate.x, rotateY: rotate.y } : {}}
              className="absolute inset-0 flex items-end md:items-center px-4 md:px-12 pb-5 md:pb-0 z-10"
            >
              <div className="text-white max-w-md w-full">
                <p className="text-[10px] md:text-sm text-primary font-semibold mb-1 tracking-wider">
                  {slide.subtitle}
                </p>

                <h2 className="text-xl sm:text-2xl md:text-5xl font-extrabold whitespace-pre-line leading-tight">
                  {slide.title}
                </h2>

                <p className="text-[11px] md:text-sm text-gray-300 mt-1 md:mt-2 line-clamp-2">
                  {slide.description}
                </p>

                {/* Trending part chip */}
                <div className="mt-2 md:mt-3 text-[10px] md:text-xs bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                  🔥 {recommendedParts[partIndex].name} — {recommendedParts[partIndex].price}
                </div>

                {/* Geo + Stock — compact on mobile */}
                <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                  <p className="text-[10px] md:text-xs text-yellow-400">
                    🚚 {location}
                  </p>
                  <p className="text-[10px] md:text-xs text-red-400">
                    ⚡ {stock} left
                  </p>
                </div>

                {/* CTA */}
                <motion.div
                  onMouseMove={handleMagnet}
                  animate={!isMobile ? { x: magnet.x, y: magnet.y } : {}}
                  className="mt-3 md:mt-4"
                >
                  <Link
                    to="/shop"
                    className="bg-primary text-primary-foreground px-6 py-2.5 md:py-3 rounded-xl md:rounded-lg font-bold text-xs md:text-sm inline-block text-center shadow-lg shadow-primary/30"
                  >
                    SHOP NOW
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Nav arrows — smaller on mobile */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1.5 md:p-2 rounded-full"
            >
              <ChevronLeft className="text-white w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1.5 md:p-2 rounded-full"
            >
              <ChevronRight className="text-white w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Slide dots — mobile only */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          {/* PROMOS — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 h-[500px]">
            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img src={promoTires} alt="Premium engine oil products at DMT Spares" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">NEW OIL</p>
                <h3 className="text-lg font-extrabold text-white">NEW OIL</h3>
                <p className="text-xs text-gray-300">Pouring the best!</p>
                <Link to="/shop?category=Engines%20%26%20Components" className="mt-3 border border-primary text-primary text-xs px-4 py-1 rounded w-fit">
                  View Details
                </Link>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              className="relative h-1/2 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img src={promoAudio} alt="Ex-Japan auto parts available at DMT Spares" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <p className="text-xs text-primary font-semibold">GET YOURS</p>
                <h3 className="text-lg font-extrabold text-white">EX-JAPAN</h3>
                <p className="text-xs text-gray-300">Get the best</p>
                <Link to="/shop?category=Electrical" className="mt-3 border border-primary text-primary text-xs px-4 py-1 rounded w-fit">
                  View Details
                </Link>
              </div>
            </motion.div>
          </div>

          {/* MOBILE PROMO CARDS — horizontal scroll */}
          <div className="lg:hidden col-span-1 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
            {[
              { img: promoTires, label: "Engine Oils", sub: "Premium quality", link: "/shop?category=Engines%20%26%20Components" },
              { img: promoAudio, label: "Ex-Japan Parts", sub: "Best deals", link: "/shop?category=Electrical" },
            ].map((p) => (
              <Link key={p.label} to={p.link} className="relative flex-shrink-0 w-[48%] h-[100px] rounded-xl overflow-hidden snap-start">
                <img src={p.img} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <p className="text-white text-xs font-bold">{p.label}</p>
                  <p className="text-white/70 text-[10px]">{p.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
