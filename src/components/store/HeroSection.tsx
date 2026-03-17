import { useState } from "react";
import { carMakes, carModels, carYears, carClasses } from "@/data/store";
import heroBanner from "@/assets/hero-banner.jpg";

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
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className={selectClass}
      >
        <option value="">Model</option>
        {make &&
          carModels[make]?.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className={selectClass}
      >
        <option value="">Year</option>
        {carYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={vehicleClass}
        onChange={(e) => setVehicleClass(e.target.value)}
        className={selectClass}
      >
        <option value="">Class</option>
        {carClasses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:scale-105 transition-transform shadow">
        Search →
      </button>
    </div>
  );
};

const HeroSection = () => (
  <section className="relative">
    <div className="relative h-[420px] md:h-[520px] overflow-hidden">
      <img
        src={heroBanner}
        alt="Engine Oil Promotion"
        className="w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container text-white max-w-3xl">
          <p className="uppercase text-yellow-400 font-semibold tracking-wider mb-2">
            One Day Special
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3">
            Get <span className="text-yellow-400">$35 Rebate</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-6">
            On All Premium Engine Oil Products
          </p>

          <button className="bg-primary hover:bg-primary/90 text-white px-7 py-3 rounded-lg font-semibold shadow-lg transition">
            Shop Now →
          </button>
        </div>
      </div>
    </div>

    {/* Vehicle Selector */}
    <div className="container -mt-10 relative z-10">
      <VehicleSelector />
    </div>
  </section>
);

export default HeroSection;