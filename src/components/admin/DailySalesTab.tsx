import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Plus, Trash2, Search, FileDown, Calendar, DollarSign, TrendingUp,
  ShoppingBag, CreditCard, X, Receipt
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PaymentMethod = "Cash" | "M-Pesa" | "Bank" | "Credit";

interface DailySale {
  id: string;
  invoice_number: string;
  product_id: string | null;
  product_name: string;
  category: string;
  quantity: number;
  buying_price: number;
  selling_price: number;
  total_amount: number;
  profit: number;
  payment_method: PaymentMethod;
  customer_name: string | null;
  notes: string | null;
  sale_date: string;
  created_at: string;
}

const generateInvoice = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const DailySalesTab = () => {
  const { products } = useStore();
  const [sales, setSales] = useState<DailySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);

  // Form state
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);

  const selectedProduct = products.find(p => p.id === productId);
  const totalAmount = quantity * sellingPrice;
  const profit = (sellingPrice - buyingPrice) * quantity;

  // Auto-fill when product changes
  useEffect(() => {
    if (selectedProduct) {
      setSellingPrice(selectedProduct.price);
      setBuyingPrice(selectedProduct.originalPrice ?? selectedProduct.price * 0.7);
    }
  }, [selectedProduct]);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("daily_sales")
      .select("*")
      .eq("sale_date", dateFilter)
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load sales"); console.error(error); }
    else setSales((data as DailySale[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSales(); }, [dateFilter]);

  const resetForm = () => {
    setProductId(""); setQuantity(1); setBuyingPrice(0); setSellingPrice(0);
    setPaymentMethod("Cash"); setCustomerName(""); setNotes("");
    setSaleDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) { toast.error("Select a product"); return; }
    if (quantity < 1) { toast.error("Quantity must be at least 1"); return; }

    const sale = {
      invoice_number: generateInvoice(),
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      category: selectedProduct.category,
      quantity,
      buying_price: buyingPrice,
      selling_price: sellingPrice,
      total_amount: totalAmount,
      profit,
      payment_method: paymentMethod,
      customer_name: customerName || null,
      notes: notes || null,
      sale_date: saleDate,
    };

    const { error } = await supabase.from("daily_sales").insert(sale);
    if (error) { toast.error("Failed to record sale"); console.error(error); return; }
    toast.success("Sale recorded!");
    resetForm();
    setShowForm(false);
    fetchSales();
  };

  const deleteSale = async (id: string) => {
    const { error } = await supabase.from("daily_sales").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Sale deleted");
    fetchSales();
  };

  const filtered = useMemo(() =>
    sales.filter(s =>
      s.product_name.toLowerCase().includes(search.toLowerCase()) ||
      s.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer_name?.toLowerCase().includes(search.toLowerCase()))
    ), [sales, search]);

  const daySummary = useMemo(() => ({
    totalSales: filtered.reduce((s, r) => s + r.total_amount, 0),
    totalProfit: filtered.reduce((s, r) => s + r.profit, 0),
    count: filtered.length,
    byCash: filtered.filter(r => r.payment_method === "Cash").reduce((s, r) => s + r.total_amount, 0),
    byMpesa: filtered.filter(r => r.payment_method === "M-Pesa").reduce((s, r) => s + r.total_amount, 0),
  }), [filtered]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`DMT Daily Sales — ${dateFilter}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Total Sales: KSH ${daySummary.totalSales.toLocaleString()} | Profit: KSH ${daySummary.totalProfit.toLocaleString()} | Transactions: ${daySummary.count}`, 14, 28);
    autoTable(doc, {
      startY: 34,
      head: [["Invoice", "Product", "Qty", "Sell Price", "Total", "Profit", "Payment", "Customer"]],
      body: filtered.map(s => [
        s.invoice_number, s.product_name, s.quantity,
        `KSH ${s.selling_price.toLocaleString()}`, `KSH ${s.total_amount.toLocaleString()}`,
        `KSH ${s.profit.toLocaleString()}`, s.payment_method, s.customer_name || "—"
      ]),
      styles: { fontSize: 8 },
    });
    doc.save(`DMT-Sales-${dateFilter}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <SummaryCard icon={DollarSign} label="Total Sales" value={`KSH ${daySummary.totalSales.toLocaleString()}`} color="bg-green-500" />
        <SummaryCard icon={TrendingUp} label="Total Profit" value={`KSH ${daySummary.totalProfit.toLocaleString()}`} color="bg-blue-500" />
        <SummaryCard icon={ShoppingBag} label="Transactions" value={daySummary.count.toString()} color="bg-purple-500" />
        <SummaryCard icon={CreditCard} label="Cash / M-Pesa" value={`${Math.round((daySummary.byCash / (daySummary.totalSales || 1)) * 100)}% / ${Math.round((daySummary.byMpesa / (daySummary.totalSales || 1)) * 100)}%`} color="bg-orange-500" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Record Sale
        </button>
        <button onClick={exportPDF} className="flex items-center gap-1.5 bg-muted text-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted/80 border border-border">
          <FileDown className="w-3.5 h-3.5" /> Export PDF
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sales..." className="pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-background w-40 md:w-52 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="pl-8 pr-2 py-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {["Invoice", "Product", "Qty", "Buy", "Sell", "Total", "Profit", "Payment", "Customer", ""].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-8 text-muted-foreground">No sales recorded for this date</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px]">{s.invoice_number}</td>
                  <td className="px-3 py-2 font-medium max-w-[140px] truncate">{s.product_name}</td>
                  <td className="px-3 py-2">{s.quantity}</td>
                  <td className="px-3 py-2">KSH {s.buying_price.toLocaleString()}</td>
                  <td className="px-3 py-2">KSH {s.selling_price.toLocaleString()}</td>
                  <td className="px-3 py-2 font-semibold">KSH {s.total_amount.toLocaleString()}</td>
                  <td className={`px-3 py-2 font-semibold ${s.profit >= 0 ? "text-green-600" : "text-destructive"}`}>KSH {s.profit.toLocaleString()}</td>
                  <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-primary/10 text-primary">{s.payment_method}</span></td>
                  <td className="px-3 py-2 text-muted-foreground">{s.customer_name || "—"}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => deleteSale(s.id)} className="text-destructive hover:text-destructive/80 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-sm flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /> Record Sale</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {/* Product */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Product *</label>
                <select value={productId} onChange={e => setProductId(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select a product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Category (auto) */}
              {selectedProduct && (
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Category</label>
                  <input value={selectedProduct.category} readOnly className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-muted/50" />
                </div>
              )}

              {/* Quantity + Prices */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Quantity *</label>
                  <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Buying Price</label>
                  <input type="number" min={0} value={buyingPrice} onChange={e => setBuyingPrice(Number(e.target.value))} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Selling Price *</label>
                  <input type="number" min={0} value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} required className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              {/* Calculated fields */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5">
                  <span className="text-[9px] text-muted-foreground block">Total Amount</span>
                  <span className="text-sm font-bold text-green-600">KSH {totalAmount.toLocaleString()}</span>
                </div>
                <div className={`${profit >= 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-destructive/10 border-destructive/20"} border rounded-lg p-2.5`}>
                  <span className="text-[9px] text-muted-foreground block">Profit</span>
                  <span className={`text-sm font-bold ${profit >= 0 ? "text-blue-600" : "text-destructive"}`}>KSH {profit.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-1.5 block">Payment Method</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["Cash", "M-Pesa", "Bank", "Credit"] as PaymentMethod[]).map(m => (
                    <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                      className={`text-[10px] font-semibold py-2 rounded-lg border transition-all ${paymentMethod === m ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary/40"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Customer Name</label>
                  <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Optional" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Sale Date</label>
                  <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>

              {/* Submit */}
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                Record Sale
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="bg-card border border-border rounded-xl p-3 hover:shadow-md transition-all hover:border-primary/20 group">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
    <p className="text-sm md:text-base font-bold text-foreground">{value}</p>
  </div>
);

export default DailySalesTab;
