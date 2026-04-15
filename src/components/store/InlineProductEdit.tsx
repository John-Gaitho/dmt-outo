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

/* CATEGORY → SUBCATEGORY MAP */

const subcategoryMap: Record<string, string[]> = {
  "Air & Fuel Delivery": [
    "Fuel Pumps",
    "Fuel Injectors",
    "Air Filters",
    "Throttle Bodies",
    "Mass Air Flow Sensors"
  ],

  "Exterior & Accessories": [
    "Side Mirrors",
    "Door Handles",
    "Bumpers",
    "Mud Flaps",
    "Grilles"
  ],

  "Headlights & Lighting": [
    "Bulbs",
    "Reflectors",
    "Corner Lights",
    "Running Lights",
    "Fog Lights"
  ],

  "Brakes & Rotors": [
    "Brake Pads",
    "Brake Discs",
    "Brake Calipers",
    "Brake Boosters",
    "ABS Components"
  ],

  "Engines & Components": [
    "Gaskets",
    "Pistons",
    "Timing Belts",
    "Engine Mounts",
    "Oil Pumps"
  ],

  "Electrical": [
    "Batteries",
    "Alternators",
    "Starters",
    "Ignition Coils",
    "Sensors"
  ],

  "Interior": [
    "Seat Covers",
    "Dashboards",
    "Floor Mats",
    "Steering Covers",
    "Door Panels"
  ],

  "Suspension": [
    "Shock Absorbers",
    "Struts",
    "Control Arms",
    "Ball Joints",
    "Bushings"
  ],

  "Oils & Fluids": [
    "Engine Oil",
    "Brake Fluid",
    "Coolant",
    "Transmission Fluid",
    "Power Steering Fluid"
  ],

  "Filters": [
    "Oil Filters",
    "Air Filters",
    "Fuel Filters",
    "Cabin Filters"
  ]
};

const InlineProductEdit = ({ product, onClose }: Props) => {
  const { updateProduct } = useStore();

  const [form, setForm] = useState({ ...product });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* FILE UPLOAD */

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file);

        if (error) {
          toast.error(`Upload failed: ${error.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        set("images", [
          ...(form.images || []),
          urlData.publicUrl,
        ]);
      }

      toast.success("Image(s) uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current)
        fileInputRef.current.value = "";
    }
  };

  /* VALIDATION */

  const validate = () => {
    if (!form.name.trim())
      return "Name is required";

    if (form.price <= 0)
      return "Price must be greater than 0";

    if (!form.category.trim())
      return "Category is required";

    if (form.stockQuantity < 0)
      return "Stock cannot be negative";

    return null;
  };

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

  /* IMAGE HANDLING */

  const addImage = () => {
    if (!newImage.trim()) return;

    set("images", [
      ...(form.images || []),
      newImage.trim(),
    ]);

    setNewImage("");
  };

  const removeImage = (i: number) => {
    set(
      "images",
      (form.images || []).filter(
        (_: string, idx: number) => idx !== i
      )
    );
  };

  const labelCls =
    "text-xs font-medium text-muted-foreground mb-1 block";

  const inputCls =
    "w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none";

  /* FILTERED SUBCATEGORIES */

  const filteredSubcategories =
    form.category &&
    subcategoryMap[form.category]
      ? subcategoryMap[form.category].filter(
          (sub) =>
            sub
              .toLowerCase()
              .includes(
                (form.subcategory || "")
                  .toLowerCase()
              )
        )
      : [];

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

        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold">
            Edit Product
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* NAME */}

          <div>
            <label className={labelCls}>
              Product Name *
            </label>

            <input
              className={inputCls}
              value={form.name}
              onChange={(e) =>
                set("name", e.target.value)
              }
            />
          </div>

          {/* PRICE */}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Price (KSH) *
              </label>

              <input
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) =>
                  set("price", +e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelCls}>
                Original Price
              </label>

              <input
                type="number"
                className={inputCls}
                value={
                  form.originalPrice || ""
                }
                onChange={(e) =>
                  set(
                    "originalPrice",
                    e.target.value
                      ? +e.target.value
                      : undefined
                  )
                }
              />
            </div>
          </div>

          {/* CATEGORY + SUBCATEGORY */}

          <div className="grid grid-cols-2 gap-3">

            {/* CATEGORY */}

            <div>
              <label className={labelCls}>
                Category *
              </label>

              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => {
                  set(
                    "category",
                    e.target.value
                  );
                  set("subcategory", "");
                }}
              >
                <option value="">
                  Select category
                </option>

                {categoryOptions.map(
                  (cat) => (
                    <option
                      key={cat}
                      value={cat}
                    >
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SUBCATEGORY WITH DROPDOWN */}

            <div className="relative">
              <label className={labelCls}>
                Subcategory
              </label>

              <input
                className={inputCls}
                placeholder="Type or select..."
                value={
                  form.subcategory || ""
                }
                onChange={(e) =>
                  set(
                    "subcategory",
                    e.target.value ||
                      undefined
                  )
                }
              />

              {filteredSubcategories.length >
                0 && (
                <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-40 overflow-y-auto">
                  {filteredSubcategories.map(
                    (sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          set(
                            "subcategory",
                            sub
                          )
                        }
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition"
                      >
                        {sub}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* STOCK / DISCOUNT / RATING */}

          <div className="grid grid-cols-3 gap-3">

            <div>
              <label className={labelCls}>
                Stock Qty
              </label>

              <input
                type="number"
                className={inputCls}
                value={form.stockQuantity}
                onChange={(e) =>
                  set(
                    "stockQuantity",
                    +e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className={labelCls}>
                Discount %
              </label>

              <input
                type="number"
                className={inputCls}
                value={
                  form.discount || ""
                }
                onChange={(e) =>
                  set(
                    "discount",
                    e.target.value
                      ? +e.target.value
                      : undefined
                  )
                }
              />
            </div>

            <div>
              <label className={labelCls}>
                Rating
              </label>

              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                className={inputCls}
                value={form.rating}
                onChange={(e) =>
                  set(
                    "rating",
                    +e.target.value
                  )
                }
              />
            </div>

          </div>

          {/* DESCRIPTION */}

          <div>
            <label className={labelCls}>
              Description
            </label>

            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={
                form.description || ""
              }
              onChange={(e) =>
                set(
                  "description",
                  e.target.value ||
                    undefined
                )
              }
            />
          </div>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-2 p-4 border-t">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            <Save className="w-4 h-4 inline mr-1" />
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default InlineProductEdit;