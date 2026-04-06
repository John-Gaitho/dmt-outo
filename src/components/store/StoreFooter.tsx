import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle
} from "lucide-react";

const StoreFooter = () => (
  <footer className="relative bg-gray-950 text-gray-300 mt-20 border-t border-gray-800">

    {/* Glow Effect */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/20 blur-3xl opacity-30" />
    </div>

    <div className="container relative py-14">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Company */}
        <div>
          <h4 className="text-2xl font-extrabold text-white mb-4 tracking-wide">
            DMT SPARES
          </h4>

          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Your trusted auto parts store in Olkalou. We supply
            genuine spare parts, engine oils, batteries,
            filters, and accessories for all vehicle types
            at competitive prices.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">

            {[
              { icon: Facebook, color: "hover:text-blue-500", link: "https://facebook.com" },
              { icon: Instagram, color: "hover:text-pink-500", link: "https://instagram.com" },
              { icon: Twitter, color: "hover:text-blue-400", link: "https://twitter.com" },
              { icon: MessageCircle, color: "hover:text-green-500", link: "https://wa.me/254712345678" }
            ].map(({ icon: Icon, color, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition transform hover:scale-110 ${color}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-white font-semibold mb-5 text-lg">
            Quick Links
          </h5>

          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "FAQ", path: "/faq" }
            ].map((link, i) => (
              <li key={i}>
                <Link to={link.path} className="relative inline-block group">
                  <span className="group-hover:text-white transition">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h5 className="text-white font-semibold mb-5 text-lg">
            Customer Service
          </h5>

          <ul className="space-y-3 text-sm">
            {[
              { name: "My Account", path: "/account" },
              { name: "Track Order", path: "/orders" },
              { name: "Returns", path: "/returns" },
              { name: "Shipping Info", path: "/shipping" },
              { name: "Warranty", path: "/warranty" }
            ].map((link, i) => (
              <li key={i}>
                <Link to={link.path} className="relative inline-block group">
                  <span className="group-hover:text-white transition">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>

          <h5 className="text-white font-semibold mb-5 text-lg">
            Find Us
          </h5>

          <div className="space-y-4 text-sm mb-5">

            <p className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary"/>
              <a
                href="https://maps.google.com/?q=Olkalou+Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Olkalou Town, Nyandarua County
              </a>
            </p>

            <p className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary"/>
              <a href="tel:+254725798506" className="hover:text-white transition">
                0725798506
              </a>
            </p>

            <p className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary"/>
              <a href="mailto:info@dmtspares.co.ke" className="hover:text-white transition">
                info@dmtspares.co.ke
              </a>
            </p>

          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-primary/20 transition">
            <iframe
              src="https://maps.google.com/maps?q=Olkalou%20Town%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="160"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>

        </div>

      </div>

    </div>

    {/* Bottom */}
    <div className="border-t border-gray-800">

      <div className="container py-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <p className="text-center md:text-left">
          © {new Date().getFullYear()}
          <span className="text-white font-medium"> DMT Spares</span>. All rights reserved.
        </p>

        {/* ✅ REAL PAYMENT ICONS */}
        <div className="flex items-center gap-4 mt-3 md:mt-0 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">

          <img
            src="/payments/visa.svg"
            alt="Visa"
            className="h-5 opacity-80 hover:opacity-100 transition"
          />

          <img
            src="/payments/mastercard.svg"
            alt="Mastercard"
            className="h-5 opacity-80 hover:opacity-100 transition"
          />

          <img
            src="/payments/mpesa.svg"
            alt="M-Pesa"
            className="h-6 opacity-90 hover:opacity-100 transition"
          />

        </div>

      </div>

    </div>

  </footer>
);

export default StoreFooter;