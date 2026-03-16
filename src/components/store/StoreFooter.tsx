import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const StoreFooter = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">

    <div className="container py-12">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Company */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4">
            DMT SPARES
          </h4>

          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Your trusted auto parts store in Olkalou. We provide quality
            spare parts, engine oils, batteries, and accessories for all
            vehicle types at affordable prices.
          </p>

          <div className="flex gap-3">
            <Facebook className="w-5 h-5 hover:text-primary cursor-pointer"/>
            <Instagram className="w-5 h-5 hover:text-primary cursor-pointer"/>
            <Twitter className="w-5 h-5 hover:text-primary cursor-pointer"/>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-white font-semibold mb-4">
            Quick Links
          </h5>

          <ul className="space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h5 className="text-white font-semibold mb-4">
            Customer Service
          </h5>

          <ul className="space-y-2 text-sm">
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/orders">Track Order</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/warranty">Warranty</Link></li>
          </ul>
        </div>

        {/* Contact + Map */}
        <div>
          <h5 className="text-white font-semibold mb-4">
            Find Us
          </h5>

          <div className="space-y-3 text-sm mb-4">

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary"/>
              Olkalou Town, Nyandarua County
            </p>

            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary"/>
              +254 712 345 678
            </p>

            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary"/>
              info@dmtspares.co.ke
            </p>

          </div>

          {/* Google Map */}
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <iframe
              src="https://maps.google.com/maps?q=Olkalou%20Kenya&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="150"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>

        </div>

      </div>

    </div>

    {/* Bottom Footer */}
    <div className="border-t border-gray-700">

      <div className="container py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <p>
          © {new Date().getFullYear()} DMT Spares Olkalou. All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>M-Pesa</span>
        </div>

      </div>

    </div>

  </footer>
);

export default StoreFooter;