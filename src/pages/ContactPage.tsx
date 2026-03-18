import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Olkalou Town, Nyandarua County</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +254 712 345 678</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@dmtspares.co.ke</p>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://maps.google.com/maps?q=Olkalou%20Kenya&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%" height="250" loading="lazy" className="border-0"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-border rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-border rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full border border-border rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default ContactPage;
