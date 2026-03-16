import { useState } from "react";
import { carMakes, carModels, carYears, carClasses } from "@/data/store";
import heroBanner from "@/assets/hero-banner.jpg";

const VehicleSelector = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");

  const selectClass = "bg-card border border-border rounded px-3 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="bg-primary rounded-lg p-3 flex flex-wrap items-center gap-2">
      <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-sm font-semibold whitespace-nowrap">
        Select Your Vehicle
      </div>
      <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }} className={selectClass}>
        <option value="">Select Make</option>
        {carMakes.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={model} onChange={(e) => setModel(e.target.value)} className={selectClass}>
        <option value="">Select Model</option>
        {make && carModels[make]?.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
        <option value="">Choose Year</option>
        {carYears.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <select value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value)} className={selectClass}>
        <option value="">Select Class</option>
        {carClasses.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
        GO →
      </button>
    </div>
  );
};

const HeroSection = () => (
  <section className="relative">
    <div className="relative">
      <img src={heroBanner} alt="Engine Oil Special" className="w-full h-[300px] md:h-[400px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent flex items-center">
        <div className="container">
          <p className="text-sale-badge font-semibold text-sm mb-1">ONE DAY SPECIAL</p>
          <h2 className="text-secondary-foreground text-3xl md:text-5xl font-black mb-1">
            GET <span className="text-primary">$35 REBATE</span>
          </h2>
          <p className="text-secondary-foreground text-lg mb-4">On All Engine Oil Products</p>
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity">
            LEARN MORE →
          </button>
        </div>
      </div>
    </div>
    <div className="container -mt-6 relative z-10">
      <VehicleSelector />
    </div>
  </section>
);

export default HeroSection;
