import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const StoreFooter = () => (
  <footer className="bg-secondary text-secondary-foreground mt-8">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-3">AUTOZPRO</h4>
          <p className="text-xs text-secondary-foreground/70 leading-relaxed">
            Your trusted source for quality auto parts and accessories. We offer the best prices on genuine parts from top brands.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-3">Quick Links</h5>
          <ul className="space-y-2">
            {["Home", "Shop", "About Us", "Contact", "FAQ"].map((link) => (
              <li key={link}>
                <Link to="/" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-3">Customer Service</h5>
          <ul className="space-y-2">
            {["My Account", "Track Order", "Returns", "Shipping Info", "Warranty"].map((link) => (
              <li key={link}>
                <Link to="/" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-3">Contact Us</h5>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs text-secondary-foreground/70">
              <MapPin className="w-3 h-3 text-primary" /> 123 Auto Parts Blvd, Detroit, MI
            </p>
            <p className="flex items-center gap-2 text-xs text-secondary-foreground/70">
              <Phone className="w-3 h-3 text-primary" /> 1-800-AUTOZPRO
            </p>
            <p className="flex items-center gap-2 text-xs text-secondary-foreground/70">
              <Mail className="w-3 h-3 text-primary" /> support@autozpro.com
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-secondary-foreground/10 py-4">
      <div className="container text-center text-xs text-secondary-foreground/50">
        © 2026 AutozPro. All rights reserved.
      </div>
    </div>
  </footer>
);

export default StoreFooter;
