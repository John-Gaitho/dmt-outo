import { useState } from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { Calendar, User, ArrowRight, X } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Brake Pads for Your Car",
    excerpt: "Learn about ceramic vs semi-metallic vs organic brake pads and which type is best.",
    date: "March 15, 2026",
    author: "DMT Team",
    category: "Guides",
    videoId: "DPTed4ljLm4",
  },
  {
    id: 2,
    title: "5 Signs Your Car Battery Needs Replacement",
    excerpt: "Don't get stranded! Watch for these warning signs.",
    date: "March 10, 2026",
    author: "DMT Team",
    category: "Tips",
    videoId: "VUA-Kl1qsEc",
  },
  {
    id: 3,
    title: "Essential Car Maintenance Checklist for Kenyan Roads",
    excerpt: "Keep your vehicle in top condition with this checklist.",
    date: "March 5, 2026",
    author: "DMT Team",
    category: "Maintenance",
    videoId: "zYHEzV171ik",
  },
  {
    id: 4,
    title: "Understanding Engine Oil Grades: 5W-30 vs 10W-40",
    excerpt: "A complete guide to engine oil viscosity grades.",
    date: "February 28, 2026",
    author: "DMT Team",
    category: "Guides",
    videoId: "FspS6yf7n50",
  },
];

const BlogPage = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />

      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          DMT Spares Blog
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Auto care tips, guides, and industry news.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* VIDEO THUMBNAIL */}
              <div
                className="aspect-video relative cursor-pointer"
                onClick={() => setActiveVideo(post.videoId)}
              >
                <img
                  src={`https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 text-white rounded-full p-4 text-xl group-hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <span className="text-[10px] font-semibold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {post.category}
                </span>

                <h2 className="text-base font-bold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>

                  <span
                    onClick={() => setActiveVideo(post.videoId)}
                    className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    Watch <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="YouTube video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default BlogPage;