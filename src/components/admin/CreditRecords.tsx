import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

import {
  Plus,
  Trash2,
  Edit,
  Search,
  FileDown,
  X,
  AlertCircle,
  CheckCircle2,
  Users,
  DollarSign,
  Clock, 
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================
   TYPES
========================= */

type CreditStatus = "unpaid" | "partial" | "paid";

interface CreditItem {
  id: string;
  product_name: string;
  quantity: number;
  amount: number;
  paid_amount: number;
  balance: number;
  sale_date: string;
  due_date: string | null;
  notes: string | null;
  status: CreditStatus;
}

interface CreditRecord {
  id: string;
  customer_name: string;
  phone: string | null;
  id_number: string | null;
  total_amount: number;
  total_paid: number;
  balance: number;
  status: CreditStatus;
  created_at: string;
  items: CreditItem[];
}

/* =========================
   FORM DEFAULTS
========================= */

const emptyItemForm = {
  product_name: "",
  quantity: 1,
  amount: 0,
  paid_amount: 0,
  sale_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  notes: "",
};

const emptyForm = {
  customer_name: "",
  phone: "",
  id_number: "",
  ...emptyItemForm,
};

/* =========================
   COMPONENT
========================= */

const CreditRecordsTab = () => {
  const [records, setRecords] = useState<CreditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // editingId = account id being edited/added to (null = new customer)
  const [editingId, setEditingId] = useState<string | null>(null);
  // editingItemId = specific item being edited (null = adding new item)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | CreditStatus>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /* =========================
     FETCH
  ========================= */

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.getCreditRecords();
      let data: CreditRecord[] = [];
      if (Array.isArray(response)) data = response;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response?.data?.data)) data = response.data.data;
      setRecords(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load credit records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  /* =========================
     HELPERS
  ========================= */

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setEditingItemId(null);
    setShowForm(false);
  };

  const serializeItems = (items: CreditItem[]) =>
    items.map((i) => ({
      product_name: i.product_name,
      quantity: i.quantity,
      amount: i.amount,
      paid_amount: i.paid_amount,
      sale_date: i.sale_date,
      due_date: i.due_date || null,
      notes: i.notes || null,
    }));

  /* =========================
     OPEN FORM: new customer
  ========================= */

  const handleNewCredit = () => {
    setEditingId(null);
    setEditingItemId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  /* =========================
     OPEN FORM: add item to existing customer
  ========================= */

  const handleAddItemFor = (record: CreditRecord) => {
    setEditingId(record.id);
    setEditingItemId(null);
    setForm({
      customer_name: record.customer_name,
      phone: record.phone || "",
      id_number: record.id_number || "",
      ...emptyItemForm,
    });
    setShowForm(true);
  };

  /* =========================
     OPEN FORM: edit a specific item
  ========================= */

  const handleEditItem = (record: CreditRecord, item: CreditItem) => {
    setEditingId(record.id);
    setEditingItemId(item.id);
    setForm({
      customer_name: record.customer_name,
      phone: record.phone || "",
      id_number: record.id_number || "",
      product_name: item.product_name,
      quantity: item.quantity,
      amount: Number(item.amount),
      paid_amount: Number(item.paid_amount),
      sale_date: item.sale_date,
      due_date: item.due_date || "",
      notes: item.notes || "",
    });
    setShowForm(true);
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.customer_name.trim() || !form.product_name.trim()) {
      toast.error("Customer and product name are required");
      return;
    }

    const amount = Number(form.amount) || 0;
    const paid = Number(form.paid_amount) || 0;

    const newItem = {
      product_name: form.product_name.trim(),
      quantity: Number(form.quantity) || 1,
      amount,
      paid_amount: paid,
      sale_date: form.sale_date,
      due_date: form.due_date || null,
      notes: form.notes.trim() || null,
    };

    try {
      // ── CASE 1: brand new customer ────────────────────────
      if (!editingId) {
        await api.createCreditRecord({
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim() || null,
          id_number: form.id_number.trim() || null,
          items: [newItem],
        });
        toast.success("Customer credit created");

      // ── CASE 2: editing an existing item ──────────────────
      } else if (editingItemId) {
        const record = records.find((r) => r.id === editingId)!;
        await api.updateCreditRecord(editingId, {
          customer_name: record.customer_name,
          phone: record.phone || null,
          id_number: record.id_number || null,
          items: record.items.map((i) =>
            i.id === editingItemId ? newItem : {
              product_name: i.product_name,
              quantity: i.quantity,
              amount: i.amount,
              paid_amount: i.paid_amount,
              sale_date: i.sale_date,
              due_date: i.due_date || null,
              notes: i.notes || null,
            }
          ),
        });
        toast.success("Item updated");

      // ── CASE 3: adding new item to existing customer ──────
      } else {
        const record = records.find((r) => r.id === editingId)!;
        await api.updateCreditRecord(editingId, {
          customer_name: record.customer_name,
          phone: record.phone || null,
          id_number: record.id_number || null,
          items: [...serializeItems(record.items), newItem],
        });
        toast.success("Item added to customer");
      }

      resetForm();
      fetchRecords();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save");
    }
  };

  /* =========================
     DELETE ENTIRE ACCOUNT
  ========================= */

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Delete this customer and all their credit items?")) return;
    try {
      await api.deleteCreditRecord(id);
      toast.success("Customer deleted");
      fetchRecords();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete");
    }
  };

  /* =========================
     DELETE SINGLE ITEM
  ========================= */

  const handleDeleteItem = async (record: CreditRecord, itemId: string) => {
    if (!confirm("Remove this item?")) return;

    const remaining = record.items.filter((i) => i.id !== itemId);

    if (remaining.length === 0) {
      // last item — delete the whole account
      await handleDeleteAccount(record.id);
      return;
    }

    try {
      await api.updateCreditRecord(record.id, {
        customer_name: record.customer_name,
        phone: record.phone || null,
        id_number: record.id_number || null,
        items: serializeItems(remaining),
      });
      toast.success("Item removed");
      fetchRecords();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to remove item");
    }
  };

  /* =========================
     MARK ITEM PAID
  ========================= */

  const handleMarkItemPaid = async (record: CreditRecord, item: CreditItem) => {
    try {
      await api.updateCreditRecord(record.id, {
        customer_name: record.customer_name,
        phone: record.phone || null,
        id_number: record.id_number || null,
        items: record.items.map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          amount: i.amount,
          paid_amount: i.id === item.id ? i.amount : i.paid_amount,
          sale_date: i.sale_date,
          due_date: i.due_date || null,
          notes: i.notes || null,
        })),
      });
      toast.success("Marked paid");
      fetchRecords();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    }
  };

  /* =========================
     GROUPS
  ========================= */

  const groups = useMemo(() => {
    return records
      .map((r) => {
        const lastDate = r.items.reduce(
          (max, i) => (i.sale_date > max ? i.sale_date : max),
          r.items[0]?.sale_date ?? r.created_at
        );
        const hasOverdue = r.items.some(
          (i) => i.due_date && i.status !== "paid" && new Date(i.due_date) < new Date()
        );
        return {
          key: r.id,
          customer_name: r.customer_name,
          phone: r.phone,
          id_number: r.id_number,
          items: r.items,
          totalAmount: Number(r.total_amount),
          totalPaid: Number(r.total_paid),
          totalBalance: Number(r.balance),
          lastDate,
          status: r.status,
          hasOverdue,
          record: r,
        };
      })
      .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [records]);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (filter !== "all" && g.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        g.customer_name.toLowerCase().includes(q) ||
        (g.phone || "").toLowerCase().includes(q) ||
        (g.id_number || "").toLowerCase().includes(q) ||
        g.items.some((i) => i.product_name.toLowerCase().includes(q))
      );
    });
  }, [groups, search, filter]);

  const totals = useMemo(() => ({
    totalOwed: records.reduce((s, r) => s + Number(r.balance), 0),
    totalCredit: records.reduce((s, r) => s + Number(r.total_amount), 0),
    customers: groups.length,
    overdue: groups.filter((g) => g.hasOverdue).length,
  }), [records, groups]);

  /* =========================
     EXPORT PDF
  ========================= */

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("DMT Olkalou - Credit Records by Customer", 14, 14);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 20);
    let cursorY = 32;
    filteredGroups.forEach((g) => {
      doc.text(`${g.customer_name} | Balance: KSH ${g.totalBalance.toLocaleString()}`, 14, cursorY);
      autoTable(doc, {
        startY: cursorY + 2,
        head: [["Date", "Product", "Qty", "Amount", "Paid", "Balance"]],
        body: g.items.map((i) => [
          i.sale_date,
          i.product_name,
          i.quantity,
          Number(i.amount).toLocaleString(),
          Number(i.paid_amount).toLocaleString(),
          Number(i.balance).toLocaleString(),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [249, 115, 22] },
      });
      cursorY = (doc as any).lastAutoTable.finalY + 8;
    });
    doc.save(`credit-by-customer-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* =========================
     MODAL TITLE
  ========================= */

  const modalTitle = () => {
    if (!editingId) return "New Customer Credit";
    if (editingItemId) return "Edit Item";
    return "Add Item to Customer";
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-4">

       {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <SummaryCard label="Outstanding (NOT PAID)" value={`KSH ${totals.totalOwed.toLocaleString()}`} icon={DollarSign} color="bg-destructive" />
        <SummaryCard label="Total Credit" value={`KSH ${totals.totalCredit.toLocaleString()}`} icon={DollarSign} color="bg-blue-500" />
        <SummaryCard label="Customers" value={String(totals.customers)} icon={Users} color="bg-purple-500" />
        <SummaryCard label="Overdue" value={String(totals.overdue)} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* TOOLBAR */}
      <div className="bg-card border border-border rounded-xl p-3 flex flex-col md:flex-row gap-2 md:items-center">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, product..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "unpaid", "partial", "paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-lg capitalize border ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-muted"
          >
            <FileDown className="w-3 h-3" /> PDF
          </button>
          <button
            onClick={handleNewCredit}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg bg-primary text-primary-foreground"
          >
            <Plus className="w-3 h-3" /> New Credit
          </button>
        </div>
      </div>

      {/* RECORDS LIST */}
      {loading ? (
        <div className="text-xs text-muted-foreground text-center py-8">Loading...</div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-8">No credit records found.</div>
      ) : (
        <div className="space-y-2">
          {filteredGroups.map((g) => {
            const isOpen = !!expanded[g.key];
            return (
              <div key={g.key} className="bg-card border border-border rounded-xl overflow-hidden">

                {/* CUSTOMER HEADER */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpanded((prev) => ({ ...prev, [g.key]: !prev[g.key] }))}
                >
                  {isOpen
                    ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  }
                  <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{g.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {g.phone || g.id_number || "No contact"} · {g.items.length} item{g.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right shrink-0 mr-1">
                    <p className="text-xs font-bold text-destructive">
                      KSH {g.totalBalance.toLocaleString()}
                    </p>
                    <StatusPill status={g.status} overdue={g.hasOverdue} />
                  </div>

                  {/* ACCOUNT-LEVEL ACTIONS */}
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddItemFor(g.record); }}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                      title="Add product to this customer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteAccount(g.key); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                      title="Delete customer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* ITEMS LIST */}
                {isOpen && (
                  <div className="border-t border-border divide-y divide-border">
                    {g.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.sale_date}
                            {item.due_date ? ` · Due ${item.due_date}` : ""}
                            {item.quantity > 1 ? ` · Qty ${item.quantity}` : ""}
                            {item.notes ? ` · ${item.notes}` : ""}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-muted-foreground">
                            KSH {Number(item.amount).toLocaleString()}
                          </p>
                          <p className="font-semibold text-destructive">
                            -{Number(item.balance).toLocaleString()}
                          </p>
                        </div>

                        <StatusPill
                          status={item.status}
                          overdue={!!(item.due_date && item.status !== "paid" && new Date(item.due_date) < new Date())}
                        />

                        {/* ITEM-LEVEL ACTIONS */}
                        <div className="flex gap-1 shrink-0">
                          {item.status !== "paid" && (
                            <button
                              onClick={() => handleMarkItemPaid(g.record, item)}
                              className="text-[10px] px-2 py-1 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleEditItem(g.record, item)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                            title="Edit item"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(g.record, item.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* TOTALS ROW */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 text-[10px] font-semibold text-muted-foreground">
                      <span className="flex-1">Total</span>
                      <span>
                        KSH {g.totalAmount.toLocaleString()} credited ·{" "}
                        KSH {g.totalPaid.toLocaleString()} paid ·{" "}
                        <span className="text-destructive">KSH {g.totalBalance.toLocaleString()} owed</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border p-4 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-sm">{modalTitle()}</h2>
              <button onClick={resetForm}><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">

              {/* Customer fields — readonly when adding to / editing an existing account */}
              <div className="col-span-2">
                <label className="text-[10px] text-muted-foreground">Customer Name *</label>
                <input
                  className={`w-full border border-border p-2 rounded ${editingId ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}`}
                  value={form.customer_name}
                  readOnly={!!editingId}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Phone</label>
                <input
                  className={`w-full border border-border p-2 rounded ${editingId ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}`}
                  value={form.phone}
                  readOnly={!!editingId}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">ID Number</label>
                <input
                  className={`w-full border border-border p-2 rounded ${editingId ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}`}
                  value={form.id_number}
                  readOnly={!!editingId}
                  onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                />
              </div>

              {/* Divider */}
              <div className="col-span-2 border-t border-border pt-3 mt-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Product / Item
                </p>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-muted-foreground">Product Name *</label>
                <input
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.product_name}
                  onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Quantity</label>
                <input
                  type="number"
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Total (KSH)</label>
                <input
                  type="number"
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Paid (KSH)</label>
                <input
                  type="number"
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.paid_amount}
                  onChange={(e) => setForm({ ...form, paid_amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Balance</label>
                <input
                  className="w-full border border-border p-2 rounded bg-muted"
                  value={Math.max(0, (Number(form.amount) || 0) - (Number(form.paid_amount) || 0))}
                  readOnly
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Sale Date</label>
                <input
                  type="date"
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.sale_date}
                  onChange={(e) => setForm({ ...form, sale_date: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-muted-foreground">Notes</label>
                <textarea
                  className="w-full border border-border p-2 rounded bg-background"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="col-span-2 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-muted p-2 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-white p-2 rounded text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================
   SUMMARY CARD
========================= */

const SummaryCard = ({
  label, value, icon: Icon, color,
}: {
  label: string; value: string; icon: any; color: string;
}) => (
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

/* =========================
   STATUS PILL
========================= */

const StatusPill = ({
  status, overdue,
}: {
  status: CreditStatus; overdue: boolean;
}) => {
  const map = {
    unpaid: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    partial: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
    paid: { cls: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  } as const;

  const s = map[status] ?? map["unpaid"];

  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize border ${s.cls}`}>
      <s.icon className="w-2.5 h-2.5" />
      {overdue ? "overdue" : status}
    </span>
  );
};

export default CreditRecordsTab;