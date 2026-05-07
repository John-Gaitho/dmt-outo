import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { api } from "@/lib/api";

import {
  Plus,
  Trash2,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================
   TYPES
========================= */

type PaymentMethod =
  | "Cash"
  | "M-Pesa"
  | "Bank"
  | "Credit";

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

/* =========================
   GENERATE INVOICE
========================= */

const generateInvoice = () => {

  const now = new Date();

  const pad = (n: number) =>
    n.toString().padStart(2, "0");

  return `INV-${now.getFullYear()}${pad(
    now.getMonth() + 1
  )}${pad(now.getDate())}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

};

/* =========================
   COMPONENT
========================= */

const DailySalesTab = () => {

  const { products } =
    useStore();

  const [sales, setSales] =
    useState<DailySale[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [buyingPrice, setBuyingPrice] =
    useState(0);

  const [sellingPrice, setSellingPrice] =
    useState(0);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash");

  const [customerName, setCustomerName] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [saleDate, setSaleDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  /* =========================
     SELECTED PRODUCT
  ========================= */

  const selectedProduct =
    products.find(
      (p) =>
        p.id === productId
    );

  const totalAmount =
    quantity * sellingPrice;

  const profit =
    (sellingPrice -
      buyingPrice) *
    quantity;

  useEffect(() => {

    if (selectedProduct) {

      setSellingPrice(
        selectedProduct.price
      );

      setBuyingPrice(
        selectedProduct.originalPrice ??
        selectedProduct.price * 0.7
      );

    }

  }, [selectedProduct]);

  /* =========================
     FETCH SALES
  ========================= */

  const fetchSales = async () => {

    try {

      setLoading(true);

      const data =
        await api.getDailySales();

      setSales(data || []);

    } catch (error) {

      toast.error(
        "Failed to load sales"
      );

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchSales();

  }, [dateFilter]);

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {

    setProductId("");
    setQuantity(1);
    setBuyingPrice(0);
    setSellingPrice(0);
    setPaymentMethod("Cash");
    setCustomerName("");
    setNotes("");

    setSaleDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  };

  /* =========================
     CREATE SALE
  ========================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!selectedProduct) {

      toast.error(
        "Select a product"
      );

      return;

    }

    if (quantity < 1) {

      toast.error(
        "Quantity must be at least 1"
      );

      return;

    }

    const sale = {

      invoice_number:
        generateInvoice(),

      product_id:
        selectedProduct.id,

      product_name:
        selectedProduct.name,

      category:
        selectedProduct.category,

      quantity,

      buying_price:
        buyingPrice,

      selling_price:
        sellingPrice,

      total_amount:
        totalAmount,

      profit,

      payment_method:
        paymentMethod,

      customer_name:
        customerName || null,

      notes:
        notes || null,

      sale_date:
        saleDate,

    };

    try {

      await api.createDailySale(
        sale
      );

      toast.success(
        "Sale recorded!"
      );

      resetForm();

      setShowForm(false);

      fetchSales();

    } catch (error) {

      toast.error(
        "Failed to record sale"
      );

      console.error(error);

    }

  };

  /* =========================
     DELETE SALE
  ========================= */

const deleteSale = async (id: string) => {

  try {

    await api.deleteDailySale(id); // ✅ FIXED (no Number)

    toast.success("Sale deleted");

    fetchSales();

  } catch (error) {

    toast.error("Failed to delete");

    console.error(error);

  }

};

  /* =========================
     SAFE FILTER
  ========================= */

  const filtered = useMemo(
    () =>
      sales.filter((s) => {

        const product =
          s.product_name?.toLowerCase() || "";

        const invoice =
          s.invoice_number?.toLowerCase() || "";

        const customer =
          s.customer_name?.toLowerCase() || "";

        const term =
          search.toLowerCase();

        return (
          product.includes(term) ||
          invoice.includes(term) ||
          customer.includes(term)
        );

      }),
    [sales, search]
  );

  /* =========================
     EXPORT PDF
  ========================= */

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.setFontSize(16);

    doc.text(
      `DMT Daily Sales — ${dateFilter}`,
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
        "Invoice",
        "Product",
        "Qty",
        "Total",
        "Profit"
      ]],

      body:
        filtered.map((s) => [

          s.invoice_number,
          s.product_name,
          s.quantity,
          `KSH ${s.total_amount}`,
          `KSH ${s.profit}`

        ]),

    });

    doc.save(
      `DMT-Sales-${dateFilter}.pdf`
    );

  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="space-y-4">

      {/* Buttons */}

      <div className="flex gap-2">

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="bg-primary text-white px-4 py-2 rounded-lg text-xs"
        >

          <Plus className="w-4 h-4 inline mr-1" />

          Record Sale

        </button>

        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs"
        >
          Export PDF
        </button>

      </div>

      {/* FORM */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow space-y-3"
        >

          <select
            value={productId}
            onChange={(e) =>
              setProductId(e.target.value)
            }
            className="w-full border p-2 rounded"
            required
          >

            <option value="">
              Select Product
            </option>

            {products.map((p) => (

              <option
                key={p.id}
                value={p.id}
              >
                {p.name}
              </option>

            ))}

          </select>

          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) =>
              setQuantity(
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded"
            placeholder="Quantity"
          />

          <input
            type="number"
            value={buyingPrice}
            onChange={(e) =>
              setBuyingPrice(
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded"
            placeholder="Buying Price"
          />

          <input
            type="number"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded"
            placeholder="Selling Price"
          />

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value as PaymentMethod
              )
            }
            className="w-full border p-2 rounded"
          >

            <option>Cash</option>
            <option>M-Pesa</option>
            <option>Bank</option>
            <option>Credit</option>

          </select>

          <input
            type="text"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="w-full border p-2 rounded"
            placeholder="Customer Name"
          />

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="w-full border p-2 rounded"
            placeholder="Notes"
          />

          <input
            type="date"
            value={saleDate}
            onChange={(e) =>
              setSaleDate(
                e.target.value
              )
            }
            className="w-full border p-2 rounded"
          />

          <div className="text-sm">

            <p>
              Total:
              <strong>
                {" "}
                KSH {totalAmount}
              </strong>
            </p>

            <p>
              Profit:
              <strong>
                {" "}
                KSH {profit}
              </strong>
            </p>

          </div>

          <div className="flex gap-2">

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-xs"
            >
              Save Sale
            </button>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="bg-gray-400 text-white px-4 py-2 rounded text-xs"
            >
              Cancel
            </button>

          </div>

        </form>

      )}

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-xs">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-2 text-left">
                Invoice
              </th>

              <th className="p-2 text-left">
                Product
              </th>

              <th className="p-2">
                Qty
              </th>

              <th className="p-2">
                Total
              </th>

              <th className="p-2">
                Profit
              </th>

              <th className="p-2">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((s) => (

              <tr key={s.id}>

                <td className="p-2">
                  {s.invoice_number}
                </td>

                <td className="p-2">
                  {s.product_name}
                </td>

                <td className="p-2 text-center">
                  {s.quantity}
                </td>

                <td className="p-2 text-center">
                  KSH {s.total_amount}
                </td>

                <td className="p-2 text-center">
                  KSH {s.profit}
                </td>

                <td className="p-2 text-center">

                  <button
                    onClick={() =>
                      deleteSale(s.id)
                    }
                    className="text-red-500"
                  >

                    <Trash2 className="w-4 h-4" />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default DailySalesTab;