import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  carMakes,
  carModels,
  carYears,
  carClasses,
} from "@/data/store";

import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";

const images = [hero1, hero2, hero3];

const typingTexts = [
  "DMT Genuine Car Parts",
  "Upgrade Your Ride Today",
  "Premium Auto Solutions",
];

/* ================= VEHICLE SELECTOR ================= */

const VehicleSelector = () => {
  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");

  const selectClass =
    "bg-white/90 backdrop-blur border border-gray-200 rounded-md px-3 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary";

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (vehicleClass) params.set("class", vehicleClass);

    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-4 flex flex-wrap items-center gap-3">
      <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        Select Your Vehicle
      </div>

      {/* Make */}
      <select
        value={make}
        onChange={(e) => {
          setMake(e.target.value);
          setModel("");
        }}
        className={selectClass}
      >
        <option value="">Make</option>
        {carMakes.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      {/* Model */}
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className={selectClass}
      >
        <option value="">Model</option>
        {make &&
          carModels[make]?.map((m) => (
            <option key={m}>{m}</option>
          ))}
      </select>

      {/* Year */}
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className={selectClass}
      >
        <option value="">Year</option>
        {carYears.map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>

      {/* Class */}
      <select
        value={vehicleClass}
        onChange={(e) => setVehicleClass(e.target.value)}
        className={selectClass}
      >
        <option value="">Class</option>
        {carClasses.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:scale-105 transition-transform shadow"
      >
        Search →
      </button>
    </div>
  );
};

/* ================= HERO SECTION ================= */

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  /* Image Slider */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000); // Match animation timing

    return () => clearInterval(interval);
  }, []);

  /* Typing Animation */
  useEffect(() => {
    const currentText = typingTexts[textIndex];

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(
          (prev) => prev + currentText[charIndex]
        );
        setCharIndex((prev) => prev + 1);
      }, 60);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setTextIndex(
          (prev) => (prev + 1) % typingTexts.length
        );
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);

  return (
    <section className="relative">

      {/* HERO IMAGE CONTAINER */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[650px] xl:h-[700px] overflow-hidden">

        {/* Images */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Hero Background"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000
            ${
              index === currentImage
                ? `opacity-100 kenburns-${index}`
                : "opacity-0"
            }`}
          />
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container text-white max-w-3xl">

            <p className="uppercase text-yellow-400 font-semibold tracking-wider mb-3">
              Premium Auto Parts
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-6">
              High quality spare parts for every vehicle — fast delivery & best prices.
            </p>

            

          </div>
        </div>

      </div>

      {/* Vehicle Selector */}
      <div className="container -mt-12 relative z-10">
        <VehicleSelector />
      </div>

    </section>
  );
};

export default HeroSection;