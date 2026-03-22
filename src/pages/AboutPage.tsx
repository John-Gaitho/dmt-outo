import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />

    {/* Hero Section */}
    <div className="bg-muted/40 border-b border-border">
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          About DMT Spares
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          DMT Spares is your trusted partner for high-quality auto parts,
          engine oils, and vehicle accessories in Nyandarua County and beyond.
          We are committed to reliability, affordability, and excellent
          customer service.
        </p>
      </div>
    </div>

    {/* Main Content */}
    <div className="container max-w-4xl py-10 space-y-10">

      {/* Who We Are */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Who We Are
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Based in Olkalou Town, DMT Spares serves customers across Nyandarua
          County and surrounding regions. We specialize in supplying genuine
          and high-quality aftermarket spare parts for a wide range of vehicles.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Whether you are a mechanic, fleet owner, or individual car owner,
          we provide dependable solutions to keep your vehicle running smoothly.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">
            Our Mission
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To keep Kenya moving by providing affordable, reliable, and
            high-quality auto parts supported by exceptional customer service.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">
            Our Vision
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To become a leading and trusted supplier of automotive parts
            across Kenya, known for quality, integrity, and customer
            satisfaction.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <p>✔ Quality products you can trust</p>
          <p>✔ Honest and transparent pricing</p>
          <p>✔ Customer-first approach</p>
          <p>✔ Reliability and consistency</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Why Choose DMT Spares
        </h2>

        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>• Wide range of genuine and aftermarket spare parts</li>
          <li>• Competitive and affordable pricing</li>
          <li>• Trusted by local mechanics and vehicle owners</li>
          <li>• Fast, friendly, and reliable customer service</li>
          <li>• Convenient location in Olkalou Town</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          Need Quality Auto Parts?
        </h2>
        <p className="text-sm opacity-90 mb-4">
          Visit our store or contact us today for reliable parts and expert
          assistance.
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-white/10 px-3 py-1 rounded-md">
            Trusted Service
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-md">
            Affordable Prices
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-md">
            Genuine Parts
          </span>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-foreground mb-4">
          Contact Us
        </h2>

        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Olkalou Town, Nyandarua County, Kenya
          </p>

          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            +254 712 345 678
          </p>

          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            info@dmtspares.co.ke
          </p>

          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Mon–Sat: 8:00 AM – 6:00 PM
          </p>
        </div>
      </section>
    </div>

    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default AboutPage;