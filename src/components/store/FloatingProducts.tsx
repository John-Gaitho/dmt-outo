import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const FloatingProducts = () => {
  const { products } = useStore();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const display = products.slice(0, 12);
  const doubled = [...display, ...display];

  if (display.length === 0) return null;

  return (
    <section className="py-5 md:py-8 overflow-hidden">
      <div className="container mb-4 md:mb-6 px-3">
        <h2 className="text-base md:text-lg font-bold text-foreground text-center">
          Trending Products
        </h2>
      </div>

      <div className="floating-slider">
        <div className="floating-track">
          {doubled.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to={`/product/${p.id}`}
              className="flex-shrink-0 w-[90px] md:w-[150px] flex flex-col items-center group"
            >
              <div
                className="p-[2px] rounded-full animate-float bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="w-[86px] h-[86px] md:w-[150px] md:h-[150px] rounded-full backdrop-blur-lg bg-white/10 border border-white/20 shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="mt-1.5 md:mt-2 text-center px-1">
                <p className="text-[10px] md:text-[11px] font-semibold text-foreground truncate max-w-[86px] md:max-w-[150px]">
                  {p.name}
                </p>
                {isAdmin && (
                  <p className="text-[10px] md:text-xs font-bold text-primary">
                    KSH {p.price.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .floating-slider { overflow: hidden; width: 100%; }
        .floating-track {
          display: flex;
          gap: 0.8rem;
          animation: floatScroll 30s linear infinite;
          width: max-content;
        }
        @media (min-width: 768px) { .floating-track { gap: 1.2rem; } }
        @keyframes floatScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .floating-track:hover { animation-play-state: paused; }
        @keyframes floatItem {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: floatItem 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default FloatingProducts;
