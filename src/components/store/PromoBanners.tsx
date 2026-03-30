import promo1 from "@/assets/promo-1.jpg";
import promo2 from "@/assets/promo-2.mp4";
import promo3 from "@/assets/promo-3.mp4";

const promos = [
  { type: "image", src: promo1 },
  { type: "video", src: promo2 },
  { type: "video", src: promo3 },
];

const PromoBanners = () => (
  <section className="py-4">
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
      {promos.map((promo, i) => (
        <div
          key={i}
          className="relative rounded-lg overflow-hidden cursor-pointer group"
        >
          {promo.type === "image" ? (
            <img
              src={promo.src}
              alt={`Promotion ${i + 1}`}
              className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <video
              src={promo.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent" />

          <button className="absolute bottom-4 left-4 bg-card text-foreground px-4 py-2 rounded text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
            SHOP NOW → 
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default PromoBanners;