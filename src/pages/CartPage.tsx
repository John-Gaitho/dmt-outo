import { useState } from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Minus, Smartphone, CreditCard, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, addOrder } = useStore();
  const { isAdmin } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) { toast.error("Please enter your name"); return; }
    if (!customerEmail.trim()) { toast.error("Please enter your email"); return; }

    if (paymentMethod === "mpesa") {
      if (!mpesaPhone.trim() || mpesaPhone.length < 10) {
        toast.error("Please enter a valid M-Pesa phone number");
        return;
      }
      setProcessing(true);
      // Simulate M-Pesa STK push
      await new Promise(r => setTimeout(r, 2000));
      toast.success("M-Pesa STK push sent! Check your phone to complete payment.");
      await new Promise(r => setTimeout(r, 1500));
    }

    const order = {
      id: `ORD-${String(Date.now()).slice(-4)}`,
      items: [...cart],
      total: cartTotal,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      customer: customerName,
      email: customerEmail,
    };
    addOrder(order);
    clearCart();
    setProcessing(false);
    toast.success(`Order ${order.id} placed successfully!`);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StoreHeader />
      <div className="container py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 md:w-20 md:h-20 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">{item.product.name}</Link>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    <p className="text-sm font-bold text-foreground mt-1">KSH {item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 border border-border rounded hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 border border-border rounded hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                  <p className="text-sm font-bold text-foreground w-20 text-right hidden md:block">KSH {(item.product.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Customer Details</h3>
                <div className="space-y-3">
                  <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Full Name *"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
                  <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Email Address *" type="email"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPaymentMethod("mpesa")}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === "mpesa" ? "border-green-500 bg-green-500/10 text-green-600" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    <Smartphone className="w-4 h-4" /> M-Pesa
                  </button>
                  <button onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === "card" ? "border-blue-500 bg-blue-500/10 text-blue-600" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                </div>
                {paymentMethod === "mpesa" && (
                  <div className="mt-3">
                    <label className="text-xs text-muted-foreground mb-1 block">M-Pesa Phone Number</label>
                    <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="e.g. 0712345678"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
                    <p className="text-[10px] text-muted-foreground mt-1">You'll receive an STK push to confirm payment</p>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <p className="text-xs text-muted-foreground mt-3">Card payment coming soon. Use M-Pesa for now.</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal ({cart.length} items)</span><span>KSH {cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base"><span>Total</span><span>KSH {cartTotal.toLocaleString()}</span></div>
                </div>
                <button onClick={handleCheckout} disabled={processing || paymentMethod === "card"}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> :
                    paymentMethod === "mpesa" ? <><Smartphone className="w-4 h-4" /> Pay KSH {cartTotal.toLocaleString()} via M-Pesa</> :
                    "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
};

export default CartPage;
