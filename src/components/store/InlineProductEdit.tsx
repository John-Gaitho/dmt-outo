import { useState, useRef } from "react";
import { Product } from "@/data/store";
import { X, Save, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

interface Props {
  product: Product;
  onClose: () => void;
}

const categoryOptions = [
  "Air & Fuel Delivery",
  "Exterior & Accessories",
  "Headlights & Lighting",
  "Brakes & Rotors",
  "Engines & Components",
  "Electrical",
  "Interior",
  "Suspension",
  "Oils & Fluids",
  "Filters",
];

const subcategoryMap: Record<string, string[]> = {
  "Air & Fuel Delivery": [
    "Fuel Pumps",
    "Fuel Injectors",
    "Air Filters",
    "Throttle Bodies",
    "Mass Air Flow Sensors",
  ],
  "Exterior & Accessories": [
    "Side Mirrors",
    "Door Handles",
    "Bumpers",
    "Mud Flaps",
    "Grilles",
  ],
  "Headlights & Lighting": [
    "Bulbs",
    "Reflectors",
    "Corner Lights",
    "Running Lights",
    "Fog Lights",
  ],
  "Brakes & Rotors": [
    "Brake Pads",
    "Brake Discs",
    "Brake Calipers",
    "Brake Boosters",
    "ABS Components",
  ],
  "Engines & Components": [
    "Gaskets",
    "Pistons",
    "Timing Belts",
    "Engine Mounts",
    "Oil Pumps",
  ],
  Electrical: [
    "Batteries",
    "Alternators",
    "Starters",
    "Ignition Coils",
    "Sensors",
  ],
  Interior: [
    "Seat Covers",
    "Dashboards",
    "Floor Mats",
    "Steering Covers",
    "Door Panels",
  ],
  Suspension: [
    "Shock Absorbers",
    "Struts",
    "Control Arms",
    "Ball Joints",
    "Bushings",
  ],
  "Oils & Fluids": [
    "Engine Oil",
    "Brake Fluid",
    "Coolant",
    "Transmission Fluid",
    "Power Steering Fluid",
  ],
  Filters: ["Oil Filters", "Air Filters", "Fuel Filters", "Cabin Filters"],
};

const CLOUDINARY_CLOUD_NAME = "dljyn5jkq";

const InlineProductEdit = ({ product, onClose }: Props) => {
  const { updateProduct } = useStore();

  const [form, setForm] = useState({ ...product });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ── CLOUDINARY UPLOAD ── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      toast.error("Missing VITE_CLOUDINARY_UPLOAD_PRESET in .env");
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const formPayload = new FormData();
          formPayload.append("file", file);
          formPayload.append("upload_preset", uploadPreset);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formPayload }
          );

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Upload failed");
          }

          const data = await res.json();
          return data.secure_url as string;
        })
      );

      set("images", [...(form.images || []), ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded!`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ── VALIDATION ── */
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (!form.category.trim()) return "Category is required";
    if (form.stockQuantity < 0) return "Stock cannot be negative";
    return null;
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    const err = validate();
    if (err) return toast.error(err);

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

  /* ── IMAGE HELPERS ── */
  const addImageUrl = () => {
    if (!newImage.trim()) return;
    set("images", [...(form.images || []), newImage.trim()]);
    setNewImage("");
  };

  const removeImage = (i: number) => {
    set(
      "images",
      (form.images || []).filter((_: string, idx: number) => idx !== i)
    );
  };

  /* ── SUBCATEGORY SUGGESTIONS ── */
  const filteredSubcategories =
    form.category && subcategoryMap[form.category]
      ? subcategoryMap[form.category].filter((sub) =>
          sub.toLowerCase().includes((form.subcategory || "").toLowerCase())
        )
      : [];

  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";
  const inputCls =
    "w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold">Edit Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* NAME */}
          <div>
            <label className={labelCls}>Product Name *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* PRICE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price (KSH) *</label>
              <input
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) => set("price", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Original Price</label>
              <input
                type="number"
                className={inputCls}
                value={form.originalPrice || ""}
                onChange={(e) =>
                  set("originalPrice", e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>

          {/* CATEGORY + SUBCATEGORY */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => {
                  set("category", e.target.value);
                  set("subcategory", "");
                }}
              >
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className={labelCls}>Subcategory</label>
              <input
                className={inputCls}
                placeholder="Type or select..."
                value={form.subcategory || ""}
                onChange={(e) => set("subcategory", e.target.value || undefined)}
              />
              {filteredSubcategories.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-card border rounded-md shadow-md max-h-40 overflow-y-auto">
                  {filteredSubcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => set("subcategory", sub)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STOCK / DISCOUNT / RATING */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Stock Qty</label>
              <input
                type="number"
                className={inputCls}
                value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Discount %</label>
              <input
                type="number"
                className={inputCls}
                value={form.discount || ""}
                onChange={(e) =>
                  set("discount", e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                className={inputCls}
                value={form.rating}
                onChange={(e) => set("rating", +e.target.value)}
              />
            </div>
          </div>

          {/* TOGGLES */}
          <div className="flex gap-4 flex-wrap pt-2">
            {[
              { key: "inStock", label: "In Stock" },
              { key: "featured", label: "Featured" },
              { key: "deal", label: "Deal" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm cursor-pointer px-3 py-1 rounded-md border hover:bg-muted transition"
              >
                <input
                  type="checkbox"
                  checked={!!(form as any)[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value || undefined)}
            />
          </div>

          {/* IMAGES */}
          <div>
            <label className={labelCls}>
              Images ({(form.images || []).length}/5)
            </label>

            {/* Previews */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.images || []).map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded border overflow-hidden group bg-muted"
                >
                  <img
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload file */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || (form.images || []).length >= 5}
                className="px-4 py-2 text-sm border border-dashed border-primary rounded-md flex items-center gap-2 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-primary" />
                )}
                {uploading ? "Uploading to Cloudinary..." : "Upload Images"}
              </button>

              {/* Add by URL */}
              <div className="flex gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Or paste image URL..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addImageUrl()}
                />
                <button
                  onClick={addImageUrl}
                  disabled={!newImage.trim()}
                  className="px-3 py-2 bg-primary text-white rounded-md disabled:opacity-50 hover:opacity-90 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-card">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-muted transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineProductEdit;