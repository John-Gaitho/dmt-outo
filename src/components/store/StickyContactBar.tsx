import { Phone, MessageCircle, ShoppingCart } from "lucide-react";

type Props = {
  productName?: string;
};

const StickyContactBar = ({ productName }: Props) => {
  const phoneNumber = "254718634116";

  const whatsappMessage = `Hello, I'm interested in ${
    productName || "your product"
  }`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg md:hidden">

      <div className="grid grid-cols-3 h-14">

        {/* Call */}
        <a
          href={`tel:+${phoneNumber}`}
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium hover:bg-muted transition-colors"
        >
          <Phone className="w-5 h-5 text-primary" />
          Call
        </a>

        

        {/* Request Price */}
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-5 h-5" />
          Get Price
        </a>

      </div>

    </div>
  );
};

export default StickyContactBar;