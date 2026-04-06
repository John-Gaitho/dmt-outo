import { useStore } from "@/context/StoreContext";
import { Link } from "react-router-dom";

const FloatingProducts = () => {
  const { products } = useStore();
  const display = products.slice(0, 12);
  const doubled = [...display, ...display];

  if (display.length === 0) return null;

  return (
    <section className="py-6 overflow-hidden">
      <div className="container mb-4">
        <h2 className="text-lg font-bold text-foreground text-center">
          🔥 Trending Products
        </h2>
      </div>
      <div className="floating-slider">
        <div className="floating-track">
          {doubled.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to={`/product/${p.id}`}
              className="flex-shrink-0 w-[140px] md:w-[180px] group"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-[120px] md:h-[150px] overflow-hidden bg-muted">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-xs font-bold text-primary">KSH {p.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .floating-slider {
          overflow: hidden;
          width: 100%;
        }
        .floating-track {
          display: flex;
          gap: 1rem;
          animation: floatScroll 30s linear infinite;
          width: max-content;
        }
        @keyframes floatScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .floating-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default FloatingProducts;
