import { categories } from "@/data/store";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySection = () => (
  <section className="py-8">
    <div className="container">
      <div className="flex items-center gap-2">
        <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground leading-tight">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground">{cat.count} Products</p>
              </div>
            </div>
          ))}
        </div>
        <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </section>
);

export default CategorySection;
