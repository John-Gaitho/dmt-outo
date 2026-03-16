import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "254718634116"; // replace with your WhatsApp number

  const sendToWhatsApp = () => {
    if (!message.trim()) return;

    const text = `
Hello DMT Spares 👋

Customer message: ${message}

Page: ${window.location.href}
`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

    setMessage("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 left-6 w-80 bg-white rounded-lg shadow-2xl border z-50">

          {/* Header */}
          <div className="bg-green-500 text-white p-3 rounded-t-lg">
            <h4 className="font-semibold">DMT Spares Support</h4>
            <p className="text-xs opacity-80">
              Chat with us on WhatsApp
            </p>
          </div>

          {/* Chat Message */}
          <div className="p-4 h-40 overflow-y-auto text-sm text-gray-600">
            Hello 👋 <br />
            Need help finding auto parts? <br />
            Send us a message and we’ll reply on WhatsApp.
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />

            <button
              onClick={sendToWhatsApp}
              className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default LiveChat;