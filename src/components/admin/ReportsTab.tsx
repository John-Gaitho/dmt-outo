import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

// adjust imports to your project
import {
  DollarSign,
  TrendingUp,
  Percent,
  Target,
  Boxes,
  AlertCircle,
  ShoppingBag,
  FileDown,
  Activity,
} from "lucide-react";

type OrderItem = {
  product: {
    name: string;
    price: number;
    image?: string;
    images?: string[];
  };
  quantity: number;
};

type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items?: OrderItem[];
};

type Product = {
  name: string;
  category: string;
  price: number;
  stockQuantity?: number;
  inStock: boolean;
  rating: number;
};

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

export default function ReportsTab() {
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reportNotes, setReportNotes] = useState("");
  const [reportType, setReportType] = useState<
    "full" | "sales" | "inventory" | "customers"
  >("full");

  // ✅ FETCH FROM BACKEND
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => fetchJSON("/api/orders"),
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchJSON("/api/products"),
  });

  // ---------------- SAFE CALCULATIONS ----------------

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const totalRevenue = safeOrders.reduce(
    (s, o) => s + (o?.total || 0),
    0
  );

  const avgOrderValue = safeOrders.length
    ? totalRevenue / safeOrders.length
    : 0;

  const totalInventoryValue = safeProducts.reduce(
    (s, p) => s + (p.price || 0) * (p.stockQuantity || 0),
    0
  );

  const lowStockProducts = safeProducts.filter(
    (p) => (p.stockQuantity ?? 0) <= 10 && p.inStock
  );

  const outOfStockProducts = safeProducts.filter((p) => !p.inStock);

  const estimatedCost = totalRevenue * 0.6;
  const grossProfit = totalRevenue - estimatedCost;

  const profitMargin = totalRevenue
    ? Math.round((grossProfit / totalRevenue) * 100)
    : 0;

  // ---------------- ITEMIZED SALES ----------------

  const soldItems = useMemo(() => {
    return safeOrders.flatMap((o) =>
      (o.items ?? []).map((item, i) => ({
        key: `${o.id}-${i}`,
        orderId: o.id,
        customer: o.customer,
        date: o.date,
        item,
      }))
    );
  }, [safeOrders]);

  // ---------------- PDF ----------------

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Business Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${reportDate}`, 14, 28);

    let y = 40;

    doc.setFontSize(12);
    doc.text(`Revenue: KSH ${totalRevenue.toLocaleString()}`, 14, y);
    y += 6;

    doc.text(`Profit: KSH ${grossProfit.toLocaleString()}`, 14, y);
    y += 6;

    doc.text(`Margin: ${profitMargin}%`, 14, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [["Order", "Customer", "Total"]],
      body: safeOrders.map((o) => [
        o.id,
        o.customer,
        o.total?.toLocaleString() || "0",
      ]),
    });

    doc.save(`report-${reportDate}.pdf`);
    toast.success("Report downloaded");
  };

  // ---------------- UI ----------------

  return (
    <div className="space-y-4">

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <StatCard title="Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Profit" value={`KSH ${grossProfit.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Margin" value={`${profitMargin}%`} icon={Percent} />
        <StatCard title="Avg Order" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={Target} />
        <StatCard title="Inventory Value" value={`KSH ${totalInventoryValue.toLocaleString()}`} icon={Boxes} />
        <StatCard title="Low Stock" value={lowStockProducts.length} icon={AlertCircle} />
      </div>

      {/* SOLD ITEMS TABLE */}
      <div className="border rounded-xl p-3 bg-card">
        <h3 className="font-semibold flex gap-2 items-center">
          <ShoppingBag className="w-4 h-4" />
          Items Sold
        </h3>

        <table className="w-full text-xs mt-2">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Order</th>
              <th>Customer</th>
            </tr>
          </thead>

          <tbody>
            {soldItems.map((s) => (
              <tr key={s.key}>
                <td>{s.item.product?.name ?? "Unknown"}</td>
                <td>{s.item.quantity}</td>
                <td>{s.orderId}</td>
                <td>{s.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REPORT BUTTON */}
      <button
        onClick={generatePDF}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        <FileDown className="inline w-4 h-4 mr-1" />
        Download Report
      </button>

    </div>
  );
}