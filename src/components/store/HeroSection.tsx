import { useState, useEffect, useCallback } from "react";
import { carMakes, carModels, carYears, carClasses } from "@/data/store";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroSlides = [
  {
    image: hero1,
    tag: "Premium Quality",
    heading: ["Find ", "Genuine Parts", " For Your Car"],
    description: "Top-quality OEM & aftermarket parts for all vehicle makes",
  },
  {
    image: hero2,
    tag: "Best Deals",
    heading: ["Up to ", "40% Off", " Brake Systems"],
    description: "Premium brake pads, rotors & calipers at unbeatable prices",
  },
  {
    image: hero3,
    tag: "New Arrivals",
    heading: ["LED ", "Headlight Kits", " Now Available"],
    description: "Upgrade your visibility with our latest lighting solutions",
  },
];

const VehicleSelector = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");

  const selectClass =
    "bg-white/90 backdrop-blur border border-gray-200 rounded-md px-3 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-4 flex flex-wrap items-center gap-3">
      <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        Select Your Vehicle
      </div>
      <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }} className={selectClass}>
        <option value="">Make</option>
        {carMakes.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={model} onChange={(e) => setModel(e.target.value)} className={selectClass}>
        <option value="">Model</option>
        {make && carModels[make]?.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
        <option value="">Year</option>
        {carYears.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <select value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value)} className={selectClass}>
        <option value="">Class</option>
        {carClasses.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:scale-105 transition-transform shadow">
        Search →
      </button>
    </div>
  );
};

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide]);

  const slide = heroSlides[current];

  return (
    <section className="relative">
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        {/* Background images with crossfade */}
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />

        {/* Animated Content */}
        <div className="absolute inset-0 flex items-center" key={current}>
          <div className="container text-white max-w-3xl">
            <p
              className="uppercase text-primary font-semibold tracking-wider mb-2 animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              {slide.tag}
            </p>

            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-3 animate-fade-in"
              style={{ animationDelay: "0.25s", animationFillMode: "both" }}
            >
              {slide.heading[0]}
              <span className="text-primary">{slide.heading[1]}</span>
              {slide.heading[2]}
            </h1>

            <p
              className="text-lg md:text-xl text-gray-200 mb-6 animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              {slide.description}
            </p>

            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 rounded-lg font-semibold shadow-lg transition animate-fade-in"
              style={{ animationDelay: "0.55s", animationFillMode: "both" }}
            >
              Shop Now →
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-4 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vehicle Selector */}
      <div className="container -mt-10 relative z-10">
        <VehicleSelector />
      </div>
    </section>
  );
};

export default HeroSection;
