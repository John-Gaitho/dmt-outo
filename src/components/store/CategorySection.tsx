import { Link } from "react-router-dom";
import catAirFuel from "@/assets/cat-air-fuel.png";
import catExterior from "@/assets/cat-exterior.png";
import catLighting from "@/assets/cat-lighting.png";
import catBrakes from "@/assets/cat-brakes.png";
import catEngine from "@/assets/cat-engine.png";
import catElectrical from "@/assets/cat-electrical.png";
import catInterior from "@/assets/cat-interior.png";
import catSuspension from "@/assets/cat-suspension.png";

const categoryImages = [
  { name: "Air & Fuel Delivery", image: catAirFuel },
  { name: "Exterior & Accessories", image: catExterior },
  { name: "Headlights & Lighting", image: catLighting },
  { name: "Brakes & Rotors", image: catBrakes },
  { name: "Engines & Components", image: catEngine },
  { name: "Electrical", image: catElectrical },
  { name: "Interior", image: catInterior },
  { name: "Suspension", image: catSuspension },
];

const CategorySection = () => (
  <section className="py-10 overflow-hidden">
    <div className="container">
      <h2 className="text-xl font-bold text-foreground mb-6 text-center">
        Shop By Category
      </h2>

      <div className="slider">
        <div className="slide-track">

          {[...categoryImages, ...categoryImages].map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 min-w-[120px]"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-muted border-2 border-border overflow-hidden group-hover:border-primary group-hover:shadow-lg transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <p className="text-xs font-semibold text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}

        </div>
      </div>
    </div>

<style>{`
.slider {
  overflow: hidden;
  width: 100%;
}

.slide-track {
  display: flex;
  width: calc(200px * 16);
  animation: scroll 25s linear infinite;
  gap: 1.5rem;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
`}</style>

  </section>
);

export default CategorySection;