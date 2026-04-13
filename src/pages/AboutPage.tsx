import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { MapPin, Phone, Mail, Clock, Shield, Truck, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
};

const values = [
  { icon: Shield, label: "Quality Guarantee", desc: "Genuine & tested parts" },
  { icon: Truck, label: "Fast Delivery", desc: "Same-day across Nyandarua" },
  { icon: Heart, label: "Customer First", desc: "Your satisfaction matters" },
  { icon: Star, label: "Trusted Since Day 1", desc: "Mechanics love us" },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />

    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-40" />
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        className="container max-w-4xl py-16 md:py-24 relative z-10 text-center"
      >
        <motion.h1 variants={fade} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          DMT Spares 🚗
        </motion.h1>
        <motion.p variants={fade} className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">
          Olkalou's most trusted auto parts shop — keeping Kenya moving since day one.
        </motion.p>
      </motion.div>
    </section>

    {/* Values */}
    <section className="container max-w-4xl -mt-8 relative z-20 px-4">
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {values.map((v) => (
          <motion.div
            key={v.label} variants={fade}
            className="bg-card border border-border rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow"
          >
            <v.icon className="w-7 h-7 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-sm text-foreground">{v.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    <div className="container max-w-4xl py-12 space-y-10 px-4">

      {/* Mission */}
      <motion.section
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        className="grid md:grid-cols-2 gap-4"
      >
        <motion.div variants={fade} className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-2">🎯 Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To keep Kenya moving with affordable, reliable, and high-quality auto parts backed by exceptional customer service.
          </p>
        </motion.div>
        <motion.div variants={fade} className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-2">🔭 Vision</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To become Kenya's leading trusted supplier of automotive parts — known for quality, integrity, and customer satisfaction.
          </p>
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
        className="bg-primary text-primary-foreground rounded-2xl p-8 text-center shadow-lg"
      >
        <h2 className="text-xl font-bold mb-2">Need Quality Auto Parts?</h2>
        <p className="text-sm opacity-90 mb-5">Visit us or call — we're always ready to help.</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-lg">
            <MapPin className="w-4 h-4" /> Olkalou Town
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-lg">
            <Phone className="w-4 h-4" /> +254 712 345 678
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" /> Mon–Sat 8AM–6PM
          </span>
        </div>
      </motion.section>
    </div>

    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default AboutPage;
