import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I find the right part for my vehicle?", a: "Use the vehicle selector on our homepage to filter parts by Make, Model, Year and Class. You can also search by part name or browse categories." },
  { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above KSH 5,000 within Kenya. Standard delivery takes 2-5 business days." },
  { q: "What payment methods do you accept?", a: "We accept M-Pesa, Visa, Mastercard, and bank transfers. All payments are secure and encrypted." },
  { q: "Can I return a product?", a: "Yes, we have a 30-day return policy. Items must be unused, in original packaging. Contact us to initiate a return." },
  { q: "Are your parts genuine/OEM?", a: "We stock both genuine OEM parts and high-quality aftermarket alternatives. Each product listing specifies the type." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an SMS and email with tracking information. You can also check order status in your account." },
  { q: "Do you offer warranty on parts?", a: "Yes, most parts come with a manufacturer warranty ranging from 6 months to 2 years depending on the product." },
  { q: "Can I pick up my order in-store?", a: "Yes! You can select 'Store Pickup' at checkout and collect from our Olkalou store during business hours (Mon-Sat 8AM-6PM)." },
];

const FAQPage = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <StoreHeader />
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-muted-foreground mb-6">Find answers to common questions about our products and services.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    <StoreFooter />
    <MobileBottomNav />
  </div>
);

export default FAQPage;
