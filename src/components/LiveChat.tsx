import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ✅ Smart hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Don't hide when chat is open
      if (!open && currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Connection failed" }));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: err.error || "Sorry, something went wrong. Please try again.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream found");

      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;

            if (content) {
              assistantSoFar += content;

              setMessages((prev) => {
                const last = prev[prev.length - 1];

                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1
                      ? { ...m, content: assistantSoFar }
                      : m
                  );
                }

                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect. Please try again or reach us on WhatsApp.",
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          fixed bottom-20 md:bottom-6 left-6 z-50 
          bg-primary text-primary-foreground 
          p-3.5 rounded-full shadow-lg 
          hover:scale-110 transition-all duration-300

          ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }
        `}
        aria-label="Live Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className={`
            fixed bottom-36 md:bottom-20 left-6 
            w-[340px] max-h-[480px] 
            bg-card rounded-xl shadow-2xl border border-border 
            z-50 flex flex-col overflow-hidden animate-scale-in
            transition-all duration-300

            ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 pointer-events-none"
            }
          `}
        >
          {/* Header */}
          <div className="bg-secondary text-secondary-foreground p-4 flex items-center gap-3">
            <div className="bg-primary rounded-full p-1.5">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">DMT Spares AI</h4>
              <p className="text-[10px] opacity-70">
                Auto parts expert • Always online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[300px]"
          >
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Bot className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  Hi! 👋 I'm your DMT Spares AI assistant.
                  <br />
                  Ask me about auto parts, compatibility, or pricing!
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about auto parts..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;