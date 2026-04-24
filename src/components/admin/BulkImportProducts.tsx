import { useState } from "react";
import * as XLSX from "xlsx";

import { api } from "@/lib/api";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";

/* =========================
   BULK IMPORT
========================= */

const BulkImportProducts = ({ refresh }: any) => {

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     FILE READ
  ========================= */

  const handleFile = (
    file: File
  ) => {

    const reader =
      new FileReader();

    reader.onload = (evt) => {

      const data =
        new Uint8Array(
          evt.target?.result as ArrayBuffer
        );

      const workbook =
        XLSX.read(data, {
          type: "array"
        });

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const json =
        XLSX.utils.sheet_to_json(sheet);

      setRows(json);

      toast.success(
        `${json.length} rows loaded`
      );

    };

    reader.readAsArrayBuffer(file);

  };

  /* =========================
     IMPORT PRODUCTS
  ========================= */

  const handleImport = async () => {

    if (rows.length === 0)
      return toast.error(
        "No data loaded"
      );

    setLoading(true);

    try {

      for (const row of rows) {

        const product = {

          name:
            row.name ||
            row.Name,

          price:
            Number(
              row.price ||
              row.Price
            ),

          category:
            row.category ||
            row.Category,

          stock_quantity:
            Number(
              row.stock ||
              row.Stock
            ),

          description:
            row.description ||
            "",

          image_url:
            row.image_url ||
            ""

        };

        await api.createProduct(
          product
        );

      }

      toast.success(
        "Products imported successfully"
      );

      setRows([]);

      refresh();

    } catch (err) {

      toast.error(
        "Import failed"
      );

    }

    setLoading(false);

  };

  /* =========================
     UI
  ========================= */

  return (

    <Card>

      <CardContent className="p-4 space-y-4">

        <h2 className="font-semibold">

          Bulk Import Products

        </h2>

        {/* FILE */}

        <Input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => {

            if (
              e.target.files?.[0]
            )

              handleFile(
                e.target.files[0]
              );

          }}
        />

        {/* PREVIEW */}

        {rows.length > 0 && (

          <div className="overflow-x-auto max-h-60 border rounded">

            <table className="w-full text-xs">

              <thead>

                <tr>

                  {Object.keys(
                    rows[0]
                  ).map((k) => (

                    <th key={k}>
                      {k}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {rows
                  .slice(0, 10)
                  .map(
                    (
                      row,
                      i
                    ) => (

                      <tr key={i}>

                        {Object.values(
                          row
                        ).map(
                          (
                            val: any,
                            j
                          ) => (

                            <td key={j}>
                              {val}
                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

        {/* IMPORT */}

        <Button
          onClick={handleImport}
          disabled={loading}
        >

          {loading
            ? "Importing..."
            : "Import Products"}

        </Button>

      </CardContent>

    </Card>

  );

};

export default BulkImportProducts;