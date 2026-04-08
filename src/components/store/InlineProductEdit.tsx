import { useState, useRef } from "react";
import { Product } from "@/data/store";
import { X, Save, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  product: Product;
  onClose: () => void;
}

const InlineProductEdit = ({ product, onClose }: Props) => {
  const { updateProduct } = useStore();
  const [form, setForm] = useState({ ...product });
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState("");

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (!form.category.trim()) return "Category is required";
    if (form.stockQuantity < 0) return "Stock cannot be negative";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setSaving(true);
    try {
      await updateProduct(form);
      toast.success("Product updated!");
      onClose();
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (!newImage.trim()) return;
    set("images", [...(form.images || []), newImage.trim()]);
    setNewImage("");
  };

  const removeImage = (i: number) => {
    set("images", (form.images || []).filter((_: string, idx: number) => idx !== i));
  };

  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";
  const inputCls = "w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground">Edit Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Product Name *</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price (KSH) *</label>
              <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", +e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Original Price (KSH)</label>
              <input type="number" className={inputCls} value={form.originalPrice || ""} onChange={(e) => set("originalPrice", e.target.value ? +e.target.value : undefined)} />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Subcategory</label>
              <input className={inputCls} value={form.subcategory || ""} onChange={(e) => set("subcategory", e.target.value || undefined)} />
            </div>
          </div>

          {/* Stock & Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Stock Qty</label>
              <input type="number" className={inputCls} value={form.stockQuantity} onChange={(e) => set("stockQuantity", +e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Discount %</label>
              <input type="number" className={inputCls} value={form.discount || ""} onChange={(e) => set("discount", e.target.value ? +e.target.value : undefined)} />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input type="number" min={0} max={5} step={0.1} className={inputCls} value={form.rating} onChange={(e) => set("rating", +e.target.value)} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-4 flex-wrap">
            {[
              { key: "inStock", label: "In Stock" },
              { key: "featured", label: "Featured" },
              { key: "deal", label: "Deal" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!(form as any)[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="rounded border-border"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} min-h-[80px]`} value={form.description || ""} onChange={(e) => set("description", e.target.value || undefined)} />
          </div>

          {/* Images */}
          <div>
            <label className={labelCls}>Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.images || []).map((img: string, i: number) => (
                <div key={i} className="relative w-16 h-16 rounded border border-border overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} placeholder="Image URL..." value={newImage} onChange={(e) => setNewImage(e.target.value)} />
              <button onClick={addImage} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border sticky bottom-0 bg-card">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-1 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineProductEdit;
