import { useMemo, useState } from "react";
import {
  DollarSign, TrendingUp, Percent, Target, Boxes, AlertCircle,
  FileDown, BarChart3, ShoppingBag, Package,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import { Order, Product } from "@/types";

/* ============ STAT CARD (local) ============ */
const StatCard = ({
  title, value, icon: Icon, color, subtitle,
}: {
  title: string; value: string; icon: any; color?: string; subtitle?: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-3 hover:shadow-md transition-all hover:border-primary/20 group">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] text-muted-foreground font-medium">{title}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color || "bg-primary/10"} group-hover:scale-110 transition-transform`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
    <p className="text-lg md:text-xl font-bold text-foreground">{value}</p>
    {subtitle && <p className="text-[9px] text-muted-foreground mt-0.5">{subtitle}</p>}
  </div>
);

/* ============ REPORTS TAB ============ */
const ReportsTab = ({
  orders = [],
  products = [],
}: {
  orders: Order[];
  products: Product[];
}) => {
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reportNotes, setReportNotes] = useState("");
  const [reportType, setReportType] = useState<
    "full" | "sales" | "inventory" | "customers"
  >("full");

  // ── SAFE DATA ────────────────────────────────────────────
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const normalizedOrders = safeOrders.map((o: any) => ({
    ...o,
    items: Array.isArray(o.items) ? o.items : [],
  }));

  // ── CALCULATIONS ─────────────────────────────────────────
  const totalRevenue = normalizedOrders.reduce(
    (s, o) => s + (o.total || 0), 0
  );
  const avgOrderValue = normalizedOrders.length
    ? totalRevenue / normalizedOrders.length : 0;
  const totalInventoryValue = safeProducts.reduce(
    (s, p) => s + (p.price || 0) * (p.stockQuantity ?? 0), 0
  );
  const lowStockProducts = safeProducts.filter(
    (p) => (p.stockQuantity ?? 100) <= 10 && p.inStock
  );
  const estimatedCost = totalRevenue * 0.6;
  const grossProfit = totalRevenue - estimatedCost;
  const profitMargin = totalRevenue
    ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  // ── FLAT ITEMS SOLD ──────────────────────────────────────
  const itemsSold = useMemo(() => {
    return normalizedOrders.flatMap((o: any) =>
      (o.items || []).map((item: any, i: number) => ({
        key: `${o.id}-${i}`,
        name: item?.product?.name || "Unknown Product",
        quantity: item?.quantity || 0,
        price: item?.product?.price || 0,
        orderId: o.id || "—",
        customer: o.customer || "Unknown",
        date: o.date || "—",
      }))
    );
  }, [normalizedOrders]);

  // ── TOP PRODUCTS ─────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    itemsSold.forEach((item) => {
      if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 };
      map[item.name].qty += item.quantity;
      map[item.name].revenue += item.price * item.quantity;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [itemsSold]);

  // ── STATUS BREAKDOWN ─────────────────────────────────────
  const statusBreakdown = useMemo(() => {
    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    return statuses.map((s) => ({
      status: s,
      count: normalizedOrders.filter((o) => o.status === s).length,
    }));
  }, [normalizedOrders]);

  // ── CUSTOMER MAP ─────────────────────────────────────────
  const customerMap = useMemo(() => {
    const map: Record<string, { name: string; email: string; orders: number; total: number }> = {};
    normalizedOrders.forEach((o: any) => {
      if (!o.email) return;
      if (!map[o.email]) map[o.email] = { name: o.customer || "Unknown", email: o.email, orders: 0, total: 0 };
      map[o.email].orders += 1;
      map[o.email].total += o.total || 0;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [normalizedOrders]);

  // ── PDF GENERATION ───────────────────────────────────────
  const generatePDF = () => {
    const doc = new jsPDF();
    const titles: Record<string, string> = {
      full: "Complete Business Report",
      sales: "Sales Report",
      inventory: "Inventory Report",
      customers: "Customer Report",
    };

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("DMT Auto Parts", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`${titles[reportType]} — ${reportDate}`, 14, 28);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

    let y = 44;

    // SALES SECTION
    if (reportType === "full" || reportType === "sales") {
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Financial Summary", 14, y);
      y += 7;

      const summaryLines = [
        [`Total Revenue`, `KSH ${totalRevenue.toLocaleString()}`],
        [`Gross Profit (est.)`, `KSH ${grossProfit.toLocaleString()}`],
        [`Profit Margin`, `${profitMargin}%`],
        [`Total Orders`, normalizedOrders.length.toString()],
        [`Avg. Order Value`, `KSH ${avgOrderValue.toFixed(0)}`],
      ];

      summaryLines.forEach(([label, val]) => {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(label, 14, y);
        doc.setTextColor(40, 40, 40);
        doc.text(val, 80, y);
        y += 6;
      });

      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Order ID", "Customer", "Items", "Total (KSH)", "Status", "Date"]],
        body: normalizedOrders.map((o: any) => [
          o.id || "—",
          o.customer || "Unknown",
          (o.items || [])
            .map((i: any) => `${i?.product?.name || "Item"} ×${i?.quantity || 0}`)
            .join("; ") || "—",
          (o.total || 0).toLocaleString(),
          o.status || "—",
          o.date || "—",
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [249, 115, 22] },
      });
    }

    // INVENTORY SECTION
    if (reportType === "full" || reportType === "inventory") {
      doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Inventory Report", 14, 16);

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total Inventory Value: KSH ${totalInventoryValue.toLocaleString()}`, 14, 24);
      doc.text(`Low Stock Items: ${lowStockProducts.length}`, 14, 30);

      autoTable(doc, {
        startY: 36,
        head: [["Product", "Category", "Price (KSH)", "Stock Qty", "Value (KSH)", "Status"]],
        body: safeProducts.map((p: any) => [
          p.name,
          p.category,
          (p.price || 0).toLocaleString(),
          (p.stockQuantity ?? 0).toString(),
          ((p.price || 0) * (p.stockQuantity ?? 0)).toLocaleString(),
          p.inStock ? "In Stock" : "Out of Stock",
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [249, 115, 22] },
        didParseCell: (data: any) => {
          const qty = parseInt(data.row.raw?.[3] || "0", 10);
          if (data.column.index === 3 && qty <= 10 && qty > 0) {
            data.cell.styles.textColor = [234, 88, 12];
            data.cell.styles.fontStyle = "bold";
          }
        },
      });
    }

    // CUSTOMERS SECTION
    if (reportType === "full" || reportType === "customers") {
      doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Customer Report", 14, 16);

      autoTable(doc, {
        startY: 24,
        head: [["Customer", "Email", "Orders", "Total Spent (KSH)"]],
        body: customerMap.map((c) => [
          c.name, c.email, c.orders.toString(), c.total.toLocaleString(),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [249, 115, 22] },
      });
    }

    // NOTES
    if (reportNotes.trim()) {
      doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Admin Notes", 14, 20);
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(reportNotes, 180);
      doc.text(lines, 14, 30);
    }

    doc.save(`DMT-${titles[reportType].replace(/ /g, "-")}-${reportDate}.pdf`);
    toast.success("Report downloaded!");
  };

  return (
    <div className="space-y-4">

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard title="Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Profit" value={`KSH ${grossProfit.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" subtitle="est. 40% margin" />
        <StatCard title="Margin" value={`${profitMargin}%`} icon={Percent} color="bg-cyan-500" />
        <StatCard title="Orders" value={normalizedOrders.length.toString()} icon={Target} color="bg-blue-500" subtitle={`Avg KSH ${avgOrderValue.toFixed(0)}`} />
        <StatCard title="Inventory" value={`KSH ${totalInventoryValue.toLocaleString()}`} icon={Boxes} color="bg-purple-500" subtitle={`${safeProducts.length} products`} />
        <StatCard title="Low Stock" value={lowStockProducts.length.toString()} icon={AlertCircle} color={lowStockProducts.length > 0 ? "bg-amber-500" : "bg-green-500"} subtitle="≤10 units" />
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Top Products Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-primary" /> Top Products by Revenue
          </h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.length > 10 ? v.slice(0, 10) + "…" : v} />
                <YAxis tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [`KSH ${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">No sales data yet</div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Order Status Breakdown
          </h3>
          <div className="space-y-2 mt-2">
            {statusBreakdown.map(({ status, count }) => {
              const pct = normalizedOrders.length ? Math.round((count / normalizedOrders.length) * 100) : 0;
              const colors: Record<string, string> = {
                pending: "bg-amber-500",
                processing: "bg-blue-500",
                shipped: "bg-indigo-500",
                delivered: "bg-green-500",
                cancelled: "bg-destructive",
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="capitalize text-foreground font-medium">{status}</span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top customers */}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Top Customers</p>
            <div className="space-y-1.5">
              {customerMap.slice(0, 4).map((c, i) => (
                <div key={c.email} className="flex items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground w-4">#{i + 1}</span>
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px]">
                    {c.name?.charAt(0) || "?"}
                  </div>
                  <span className="flex-1 truncate text-foreground font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.orders} orders</span>
                  <span className="font-semibold text-foreground">KSH {c.total.toLocaleString()}</span>
                </div>
              ))}
              {customerMap.length === 0 && (
                <p className="text-[10px] text-muted-foreground">No customer data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ITEMS SOLD TABLE ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-3 py-2.5 border-b border-border flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-xs text-foreground">Items Sold</h3>
          <span className="ml-auto text-[10px] text-muted-foreground">{itemsSold.length} line items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left text-[10px] text-muted-foreground">
                <th className="p-2.5 font-medium">Product</th>
                <th className="p-2.5 font-medium">Qty</th>
                <th className="p-2.5 font-medium">Revenue</th>
                <th className="p-2.5 font-medium">Order</th>
                <th className="p-2.5 font-medium">Customer</th>
                <th className="p-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {itemsSold.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground text-xs">No items sold yet</td>
                </tr>
              ) : (
                itemsSold.map((item) => (
                  <tr key={item.key} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-2.5 font-medium text-foreground truncate max-w-[160px]">{item.name}</td>
                    <td className="p-2.5 text-muted-foreground">{item.quantity}</td>
                    <td className="p-2.5 font-semibold text-foreground">
                      KSH {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="p-2.5 text-muted-foreground text-[10px]">{item.orderId}</td>
                    <td className="p-2.5 text-muted-foreground truncate max-w-[120px]">{item.customer}</td>
                    <td className="p-2.5 text-muted-foreground text-[10px]">{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GENERATE PDF PANEL ── */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
          <FileDown className="w-4 h-4 text-primary" /> Generate Report PDF
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Report Type */}
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground"
            >
              <option value="full">Full Report</option>
              <option value="sales">Sales Only</option>
              <option value="inventory">Inventory Only</option>
              <option value="customers">Customers Only</option>
            </select>
          </div>

          {/* Report Date */}
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Report Date</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground"
            />
          </div>

          {/* Download Button */}
          <div className="flex items-end">
            <button
              onClick={generatePDF}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Admin Notes (optional)</label>
          <textarea
            value={reportNotes}
            onChange={(e) => setReportNotes(e.target.value)}
            placeholder="Any notes to include at the end of the report..."
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;