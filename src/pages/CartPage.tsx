import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, addOrder } = useStore();
  const { isAdmin } = useAuth();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = {
      id: `ORD-${String(Date.now()).slice(-4)}`,
      items: [...cart],
      total: cartTotal,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      customer: "Guest Customer",
      email: "guest@example.com",
    };
    addOrder(order);
    clearCart();
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
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">{item.product.name}</Link>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    {isAdmin && <p className="text-sm font-bold text-foreground mt-1">KSH {item.product.price.toLocaleString()}</p>}
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 border border-border rounded hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 border border-border rounded hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                  {isAdmin && <p className="text-sm font-bold text-foreground w-20 text-right hidden md:block">KSH {(item.product.price * item.quantity).toLocaleString()}</p>}
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              {isAdmin ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>KSH {cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground"><span>Total</span><span>KSH {cartTotal.toLocaleString()}</span></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Contact us for pricing details</p>
              )}
              <button onClick={handleCheckout} className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity">
                {isAdmin ? "Proceed to Checkout" : "Request Quote"}
              </button>
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
