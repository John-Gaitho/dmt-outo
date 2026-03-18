import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-4">About DMT Spares</h1>
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            DMT Spares is Olkalou's trusted auto parts store, serving Nyandarua County and beyond. We provide quality genuine and aftermarket spare parts, engine oils, batteries, and accessories for all vehicle types at competitive prices.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our mission is to keep Kenya moving by providing affordable, reliable auto parts with exceptional customer service.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-4">Contact Us</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Olkalou Town, Nyandarua County, Kenya</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +254 712 345 678</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@dmtspares.co.ke</p>
            <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Mon–Sat: 8:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default AboutPage;
