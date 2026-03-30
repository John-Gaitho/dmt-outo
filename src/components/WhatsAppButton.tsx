import { useState, useEffect } from "react";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(true);

  const phoneNumber = "254718634116";
  const message = "Hello, I'm interested in your auto parts.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // scrolling down → hide
        setVisible(false);
      } else {
        // scrolling up → show
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed right-20 z-50 flex flex-col items-end
        bottom-20 md:bottom-8
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
    >
      {/* Tooltip */}
      <div
        className={`mb-2 px-3 py-1 text-sm bg-black text-white rounded-lg shadow transition-all duration-300 ${
          showTooltip
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        Chat with us
      </div>

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(false)}
        className="
          bg-green-500 hover:bg-green-600 text-white
          p-3.5 rounded-full shadow-lg
          hover:scale-110 transition-transform
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2C6.48 2 2 6.24 2 11.48c0 1.86.52 3.6 1.43 5.1L2 22l5.6-1.38c1.42.78 3.05 1.22 4.74 1.22 5.52 0 10-4.24 10-9.48S17.52 2 12 2zm0 17.26c-1.48 0-2.91-.39-4.16-1.13l-.3-.18-3.33.82.89-3.18-.2-.32a7.17 7.17 0 01-1.1-3.8c0-3.97 3.6-7.2 8.2-7.2s8.2 3.23 8.2 7.2-3.6 7.2-8.2 7.2zm4.53-5.36c-.25-.12-1.46-.71-1.69-.79-.23-.08-.4-.12-.57.12-.17.23-.66.79-.81.95-.15.17-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.22-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.38.1-.5.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.68 4.29 3.75.6.26 1.07.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.17.21-.57.21-1.06.15-1.17-.06-.11-.23-.18-.48-.31z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;