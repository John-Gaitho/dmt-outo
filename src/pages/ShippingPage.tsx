import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { Truck, MapPin, Clock, Package } from "lucide-react";

const ShippingPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Truck className="w-6 h-6 text-primary" /> Shipping Information
      </h1>
      <p className="text-sm text-muted-foreground mb-6">We deliver across Kenya with fast and reliable shipping.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Package className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-foreground">Free Shipping</h3>
          <p className="text-sm text-muted-foreground">Orders above KSH 5,000</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-foreground">2-5 Business Days</h3>
          <p className="text-sm text-muted-foreground">Standard delivery time</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Region</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Delivery Time</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Cost</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border"><td className="py-2">Nyandarua County</td><td>1-2 days</td><td>KSH 200</td></tr>
                <tr className="border-b border-border"><td className="py-2">Nairobi / Central</td><td>2-3 days</td><td>KSH 350</td></tr>
                <tr className="border-b border-border"><td className="py-2">Coast / Western</td><td>3-5 days</td><td>KSH 500</td></tr>
                <tr><td className="py-2">Rest of Kenya</td><td>3-5 days</td><td>KSH 450</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Store Pickup</h2>
          <p className="text-sm text-muted-foreground">Free pickup available at our Olkalou store. Select "Store Pickup" at checkout.</p>
          <p className="text-sm text-muted-foreground mt-2"><strong>Hours:</strong> Monday – Saturday, 8:00 AM – 6:00 PM</p>
        </div>
      </div>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default ShippingPage;
