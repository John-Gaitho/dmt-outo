import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

const ReturnsPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <RotateCcw className="w-6 h-6 text-primary" /> Returns Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-6">We want you to be completely satisfied with your purchase.</p>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> 30-Day Return Window</h2>
          <p className="text-sm text-muted-foreground">You have 30 days from the date of delivery to return any item for a full refund or exchange.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Eligible for Return</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Unused items in original packaging</li>
            <li>• Defective or damaged products</li>
            <li>• Wrong item received</li>
            <li>• Items that don't match the description</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Not Eligible for Return</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Installed or used parts</li>
            <li>• Electrical components that have been opened</li>
            <li>• Special order / custom items</li>
            <li>• Items without original packaging</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-3">How to Return</h2>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Contact us via WhatsApp or email with your order number</li>
            <li>We'll send you a return authorization</li>
            <li>Pack the item securely in original packaging</li>
            <li>Drop off at our Olkalou store or arrange pickup</li>
            <li>Refund processed within 3-5 business days</li>
          </ol>
        </div>
      </div>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default ReturnsPage;
