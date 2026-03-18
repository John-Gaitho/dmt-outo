import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Brake Pads for Your Car",
    excerpt: "Learn about ceramic vs semi-metallic vs organic brake pads and which type is best for your driving style and vehicle.",
    date: "March 15, 2026",
    author: "DMT Team",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "5 Signs Your Car Battery Needs Replacement",
    excerpt: "Don't get stranded! Watch for these warning signs that indicate your battery is nearing the end of its life.",
    date: "March 10, 2026",
    author: "DMT Team",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Essential Car Maintenance Checklist for Kenyan Roads",
    excerpt: "Keep your vehicle in top condition with our comprehensive maintenance checklist designed for local driving conditions.",
    date: "March 5, 2026",
    author: "DMT Team",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Understanding Engine Oil Grades: 5W-30 vs 10W-40",
    excerpt: "A complete guide to engine oil viscosity grades and how to pick the right one for your car's engine.",
    date: "February 28, 2026",
    author: "DMT Team",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
  },
];

const BlogPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">DMT Spares Blog</h1>
      <p className="text-sm text-muted-foreground mb-8">Auto care tips, guides, and industry news.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-semibold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">{post.category}</span>
              <h2 className="text-base font-bold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                </div>
                <span className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default BlogPage;
