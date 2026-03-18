import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { Shield, CheckCircle } from "lucide-react";

const WarrantyPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" /> Warranty Information
      </h1>
      <p className="text-sm text-muted-foreground mb-6">All products sold at DMT Spares come with manufacturer warranty coverage.</p>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">Warranty Coverage</h2>
          <div className="space-y-3">
            {[
              { cat: "Brake Parts", period: "12 months" },
              { cat: "Batteries", period: "6-24 months (varies by brand)" },
              { cat: "Engine Components", period: "12 months" },
              { cat: "Headlights & Lighting", period: "6 months" },
              { cat: "Suspension Parts", period: "12 months" },
              { cat: "Electrical Components", period: "6 months" },
            ].map((item) => (
              <div key={item.cat} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{item.cat}</span>
                <span className="text-sm font-medium text-primary">{item.period}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">What's Covered</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Manufacturing defects</li>
            <li>• Premature failure under normal use</li>
            <li>• Material or workmanship issues</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">What's Not Covered</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Damage from improper installation</li>
            <li>• Normal wear and tear</li>
            <li>• Misuse or modifications</li>
            <li>• Damage from accidents</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">How to Claim Warranty</h2>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Keep your receipt / order confirmation</li>
            <li>Contact us with the product details and issue description</li>
            <li>Bring or ship the part to our Olkalou store</li>
            <li>We'll inspect and process replacement or refund within 7 days</li>
          </ol>
        </div>
      </div>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default WarrantyPage;
