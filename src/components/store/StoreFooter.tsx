import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const StoreFooter = () => (
  <footer className="relative bg-black text-gray-300 mt-28 border-t border-gray-800 overflow-hidden">

    {/* 🔥 MULTI-LAYER GLOW */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[140px] opacity-40" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-primary/10 blur-3xl opacity-30" />
      <div className="absolute right-0 top-1/3 w-[200px] h-[200px] bg-purple-500/10 blur-3xl opacity-20" />
    </div>

    <div className="container relative py-20">

      {/* 🚀 NEWSLETTER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-20 p-8 rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl"
      >
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Join the DMT Network 🚗
          </h3>
          <p className="text-sm text-gray-400">
            Be first to access new stock, exclusive deals & insider offers.
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:border-primary w-full md:w-[260px]"
          />
          <button className="px-5 py-3 bg-primary text-white rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
            Subscribe <ArrowRight size={16}/>
          </button>
        </div>
      </motion.div>

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

        {/* BRAND */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={1}>
          <h4 className="text-3xl font-extrabold text-white mb-4 tracking-wide">
            DMT SPARES
          </h4>

          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Powering your journey with genuine auto parts, reliability,
            and unmatched service in Olkalou and beyond.
          </p>

          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter, MessageCircle].map((Icon, i) => (
              <motion.a
                whileHover={{ scale: 1.15 }}
                key={i}
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition shadow-md"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* LINKS */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={2}>
          <h5 className="text-white font-semibold mb-6 text-lg">
            Explore
          </h5>

          <ul className="space-y-4 text-sm">
            {["Home","Shop","About","Contact","FAQ"].map((item,i)=>(
              <li key={i}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="group flex items-center gap-3 hover:text-white transition"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* SERVICES */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={3}>
          <h5 className="text-white font-semibold mb-6 text-lg">
            Support
          </h5>

          <ul className="space-y-4 text-sm">
            {["Account","Orders","Returns","Shipping","Warranty"].map((item,i)=>(
              <li key={i}>
                <Link
                  to="/"
                  className="group flex items-center gap-3 hover:text-white transition"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CONTACT */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={4}>
          <h5 className="text-white font-semibold mb-6 text-lg">
            Contact
          </h5>

          <div className="space-y-5 text-sm mb-6">

            <p className="flex items-center gap-3 hover:text-white transition">
              <MapPin className="w-4 h-4 text-primary"/>
              Olkalou Town
            </p>

            <p className="flex items-center gap-3 hover:text-white transition">
              <Phone className="w-4 h-4 text-primary"/>
              0725798506
            </p>

            <p className="flex items-center gap-3 hover:text-white transition">
              <Mail className="w-4 h-4 text-primary"/>
              info@dmtspares.co.ke
            </p>

          </div>

          <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:scale-[1.03] transition">
            <iframe
              src="https://maps.google.com/maps?q=Olkalou%20Town%20Kenya&z=14&output=embed"
              width="100%"
              height="160"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </motion.div>

      </div>
    </div>

    {/* 💎 TRUST STRIP */}
    <div className="border-t border-gray-800 bg-gray-900/40 backdrop-blur">
      <div className="container py-6 flex flex-wrap justify-center gap-6 text-xs text-gray-400">
        <span>✔ Genuine Parts</span>
        <span>✔ Fast Delivery</span>
        <span>✔ Secure Payments</span>
        <span>✔ Trusted by 1000+ Customers</span>
      </div>
    </div>

    {/* 🔻 BOTTOM */}
    <div className="border-t border-gray-800 bg-black/60 backdrop-blur">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <p>
          © {new Date().getFullYear()}
          <span className="text-white font-medium"> DMT Spares</span>
        </p>

        <div className="flex items-center gap-4 mt-3 md:mt-0 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
          <img src="/payments/visa.svg" className="h-5 opacity-80 hover:opacity-100 transition"/>
          <img src="/payments/mastercard.svg" className="h-5 opacity-80 hover:opacity-100 transition"/>
          <img src="/payments/mpesa.svg" className="h-6 opacity-90 hover:opacity-100 transition"/>
        </div>

      </div>
    </div>

    

  </footer>
);

export default StoreFooter;