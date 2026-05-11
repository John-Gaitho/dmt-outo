import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Search, FileDown, X, AlertCircle, CheckCircle2, Clock, DollarSign, Users } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type CreditStatus = "unpaid" | "partial" | "paid";

interface CreditRecord {
  id: string;
  customer_name: string;
  phone: string | null;
  id_number: string | null;
  product_name: string;
  quantity: number;
  amount: number;
  paid_amount: number;
  balance: number;
  sale_date: string;
  due_date: string | null;
  notes: string | null;
  status: CreditStatus;
  created_at: string;
}

const emptyForm = {
  customer_name: "",
  phone: "",
  id_number: "",
  product_name: "",
  quantity: 1,
  amount: 0,
  paid_amount: 0,
  sale_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  notes: "",
};

const CreditRecordsTab = () => {
  const [records, setRecords] = useState<CreditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | CreditStatus>("all");

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("credit_records")
      .select("*")
      .order("sale_date", { ascending: false });
    if (error) toast.error("Failed to load credit records");
    else setRecords((data || []) as CreditRecord[]);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const computedStatus = (amount: number, paid: number): CreditStatus => {
    if (paid >= amount && amount > 0) return "paid";
    if (paid > 0) return "partial";
    return "unpaid";
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (r: CreditRecord) => {
    setEditingId(r.id);
    setForm({
      customer_name: r.customer_name,
      phone: r.phone || "",
      id_number: r.id_number || "",
      product_name: r.product_name,
      quantity: r.quantity,
      amount: Number(r.amount),
      paid_amount: Number(r.paid_amount),
      sale_date: r.sale_date,
      due_date: r.due_date || "",
      notes: r.notes || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.product_name.trim()) {
      toast.error("Customer and product name are required");
      return;
    }
    const amount = Number(form.amount) || 0;
    const paid = Number(form.paid_amount) || 0;
    const balance = Math.max(0, amount - paid);
    const status = computedStatus(amount, paid);

    const payload = {
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim() || null,
      id_number: form.id_number.trim() || null,
      product_name: form.product_name.trim(),
      quantity: Number(form.quantity) || 1,
      amount,
      paid_amount: paid,
      balance,
      sale_date: form.sale_date,
      due_date: form.due_date || null,
      notes: form.notes.trim() || null,
      status,
    };

    if (editingId) {
      const { error } = await supabase.from("credit_records").update(payload).eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Credit record updated");
    } else {
      const { error } = await supabase.from("credit_records").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Credit record added");
    }
    resetForm();
    fetchRecords();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this credit record?")) return;
    const { error } = await supabase.from("credit_records").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    fetchRecords();
  };

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.customer_name.toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        (r.id_number || "").toLowerCase().includes(q)
      );
    });
  }, [records, search, filter]);

  const totals = useMemo(() => {
    const totalOwed = records.reduce((s, r) => s + Number(r.balance), 0);
    const totalCredit = records.reduce((s, r) => s + Number(r.amount), 0);
    const customers = new Set(records.map(r => r.customer_name.toLowerCase())).size;
    const overdue = records.filter(r => r.due_date && r.status !== "paid" && new Date(r.due_date) < new Date()).length;
    return { totalOwed, totalCredit, customers, overdue };
  }, [records]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("DMT Olkalou - Credit Records", 14, 14);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 20);
    doc.text(`Total Outstanding: KSH ${totals.totalOwed.toLocaleString()}`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [["Date", "Customer", "Phone", "Product", "Qty", "Amount", "Paid", "Balance", "Due", "Status"]],
      body: filtered.map(r => [
        r.sale_date,
        r.customer_name,
        r.phone || "-",
        r.product_name,
        r.quantity,
        Number(r.amount).toLocaleString(),
        Number(r.paid_amount).toLocaleString(),
        Number(r.balance).toLocaleString(),
        r.due_date || "-",
        r.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] },
    });
    doc.save(`credit-records-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const liveBalance = Math.max(0, (Number(form.amount) || 0) - (Number(form.paid_amount) || 0));

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <SummaryCard label="Outstanding" value={`KSH ${totals.totalOwed.toLocaleString()}`} icon={DollarSign} color="bg-destructive" />
        <SummaryCard label="Total Credit" value={`KSH ${totals.totalCredit.toLocaleString()}`} icon={DollarSign} color="bg-blue-500" />
        <SummaryCard label="Customers" value={String(totals.customers)} icon={Users} color="bg-purple-500" />
        <SummaryCard label="Overdue" value={String(totals.overdue)} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-3 flex flex-col md:flex-row gap-2 md:items-center">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer, phone, product, ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "unpaid", "partial", "paid"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-lg capitalize border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:bg-muted"}`}>
              {f}
            </button>
          ))}
          <button onClick={exportPDF} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-muted text-foreground hover:bg-muted/70">
            <FileDown className="w-3 h-3" /> PDF
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-3 h-3" /> Add Credit
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={resetForm}>
          <div className="bg-card border border-border rounded-2xl p-4 w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">{editingId ? "Edit Credit Record" : "New Credit Record"}</h2>
              <button onClick={resetForm} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <Field label="Customer Name *">
                <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="07XX XXX XXX" />
              </Field>
              <Field label="ID Number">
                <input value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Product / Item *">
                <input required value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Quantity">
                <input type="number" min={1} value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className={inputCls} />
              </Field>
              <Field label="Total Amount (KSH)">
                <input type="number" min={0} step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className={inputCls} />
              </Field>
              <Field label="Amount Paid (KSH)">
                <input type="number" min={0} step="0.01" value={form.paid_amount} onChange={e => setForm({ ...form, paid_amount: Number(e.target.value) })} className={inputCls} />
              </Field>
              <Field label="Balance (auto)">
                <input readOnly value={liveBalance} className={`${inputCls} bg-muted font-semibold`} />
              </Field>
              <Field label="Sale Date">
                <input type="date" value={form.sale_date} onChange={e => setForm({ ...form, sale_date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Due Date">
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className={inputCls} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Notes">
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} min-h-[60px]`} />
                </Field>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-1">
                <button type="button" onClick={resetForm} className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  {editingId ? "Update" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No credit records {search || filter !== "all" ? "match your filters" : "yet. Click Add Credit to start."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left p-2.5">Date</th>
                  <th className="text-left p-2.5">Customer</th>
                  <th className="text-left p-2.5 hidden md:table-cell">Phone</th>
                  <th className="text-left p-2.5">Product</th>
                  <th className="text-right p-2.5">Amount</th>
                  <th className="text-right p-2.5 hidden sm:table-cell">Paid</th>
                  <th className="text-right p-2.5">Balance</th>
                  <th className="text-left p-2.5 hidden lg:table-cell">Due</th>
                  <th className="text-left p-2.5">Status</th>
                  <th className="text-right p-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const overdue = r.due_date && r.status !== "paid" && new Date(r.due_date) < new Date();
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-2.5 whitespace-nowrap">{r.sale_date}</td>
                      <td className="p-2.5">
                        <div className="font-semibold text-foreground">{r.customer_name}</div>
                        {r.id_number && <div className="text-[10px] text-muted-foreground">ID: {r.id_number}</div>}
                      </td>
                      <td className="p-2.5 hidden md:table-cell">{r.phone || "-"}</td>
                      <td className="p-2.5">
                        <div>{r.product_name}</div>
                        <div className="text-[10px] text-muted-foreground">Qty: {r.quantity}</div>
                      </td>
                      <td className="p-2.5 text-right">{Number(r.amount).toLocaleString()}</td>
                      <td className="p-2.5 text-right hidden sm:table-cell">{Number(r.paid_amount).toLocaleString()}</td>
                      <td className="p-2.5 text-right font-semibold text-destructive">{Number(r.balance).toLocaleString()}</td>
                      <td className="p-2.5 hidden lg:table-cell">
                        <span className={overdue ? "text-destructive font-semibold" : ""}>{r.due_date || "-"}</span>
                      </td>
                      <td className="p-2.5"><StatusPill status={r.status} overdue={!!overdue} /></td>
                      <td className="p-2.5">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(r)} className="p-1.5 rounded hover:bg-muted text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const inputCls = "w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[10px] font-semibold text-muted-foreground mb-1">{label}</span>
    {children}
  </label>
);

const SummaryCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) => (
  <div className="bg-card border border-border rounded-xl p-3">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
    <p className="text-base md:text-lg font-bold text-foreground">{value}</p>
  </div>
);

const StatusPill = ({ status, overdue }: { status: CreditStatus; overdue: boolean }) => {
  const map = {
    unpaid: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    partial: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
    paid: { cls: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize border ${s.cls}`}>
      <s.icon className="w-2.5 h-2.5" />
      {overdue ? "overdue" : status}
    </span>
  );
};

export default CreditRecordsTab;