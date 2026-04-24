import { useState } from "react";
import { api } from "@/lib/api";
import BulkImportProducts from "./BulkImportProducts";
import { supabase } from "@/integrations/supabase/client";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import {
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

import { toast } from "sonner";

/* =========================
   PRODUCTS TAB
========================= */

const ProductsTab = ({ products, refresh }: any) => {

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    price: "",
    category: "",
    stock_quantity: "",
    description: "",
    image_url: ""
  };

  const [form, setForm] =
    useState(emptyForm);

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    products.filter((p: any) =>
      p.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =========================
     OPEN CREATE
  ========================= */

  const openCreate = () => {

    setEditingProduct(null);
    setForm(emptyForm);
    setOpen(true);

  };

  /* =========================
     OPEN EDIT
  ========================= */

  const openEdit = (product: any) => {

    setEditingProduct(product);
    setForm(product);
    setOpen(true);

  };

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleUpload = async (file: File) => {

    try {

      const fileName =
        `${Date.now()}-${file.name}`;

      const { error } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, file);

      if (error) throw error;

      const { data } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

      setForm({
        ...form,
        image_url: data.publicUrl
      });

      toast.success("Image uploaded");

    } catch {

      toast.error("Upload failed");

    }

  };

  /* =========================
     SAVE PRODUCT
  ========================= */

  const handleSave = async () => {

    try {

      if (!form.name)
        return toast.error("Name required");

      if (editingProduct) {

        await api.updateProduct(
          editingProduct.id,
          form
        );

        toast.success("Product updated");

      } else {

        await api.createProduct(form);

        toast.success("Product created");

      }

      setOpen(false);
      refresh();

    } catch {

      toast.error("Save failed");

    }

  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete = async (id: number) => {

    if (!confirm("Delete product?"))
      return;

    try {

      await api.deleteProduct(id);

      toast.success("Deleted");

      refresh();

    } catch {

      toast.error("Delete failed");

    }

  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="space-y-4">

      {/* HEADER */}

      <div className="flex flex-wrap gap-2 justify-between items-center">

        <h2 className="text-lg font-semibold">

          Products

        </h2>

        <div className="flex gap-2">

          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-48"
          />

          <Button onClick={openCreate}>

            <Plus className="w-4 h-4 mr-2" />

            Add Product

          </Button>

        </div>

      </div>

      {/* BULK IMPORT */}

      <BulkImportProducts refresh={refresh} />

      {/* PRODUCT TABLE */}

      <Card>

        <CardContent className="p-4 overflow-x-auto">

          {filteredProducts.length === 0 ? (

            <p className="text-sm text-muted-foreground">

              No products found

            </p>

          ) : (

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b">

                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (p: any) => (

                    <tr
                      key={p.id}
                      className="border-b"
                    >

                      <td>

                        {p.image_url && (

                          <img
                            src={p.image_url}
                            className="w-10 h-10 object-cover rounded"
                          />

                        )}

                      </td>

                      <td>{p.name}</td>

                      <td>{p.category}</td>

                      <td>
                        KSH {p.price}
                      </td>

                      <td>
                        {p.stock_quantity}
                      </td>

                      <td className="flex gap-2">

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            openEdit(p)
                          }
                        >

                          <Pencil className="w-4 h-4" />

                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleDelete(p.id)
                          }
                        >

                          <Trash2 className="w-4 h-4 text-red-500" />

                        </Button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </CardContent>

      </Card>

      {/* MODAL */}

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              {editingProduct
                ? "Edit Product"
                : "Add Product"}

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-3">

            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />

            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value
                })
              }
            />

            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value
                })
              }
            />

            <Input
              placeholder="Stock"
              type="number"
              value={form.stock_quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock_quantity:
                    e.target.value
                })
              }
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
            />

            {/* IMAGE */}

            <div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {

                  if (e.target.files?.[0])
                    handleUpload(
                      e.target.files[0]
                    );

                }}
              />

              {form.image_url && (

                <img
                  src={form.image_url}
                  className="w-20 h-20 mt-2 rounded object-cover"
                />

              )}

            </div>

            <Button
              className="w-full"
              onClick={handleSave}
            >

              Save Product

            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </div>

  );

};

export default ProductsTab;