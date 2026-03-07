import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMedicines, useRecordSale, useSales } from "@/hooks/useQueries";
import { Loader2, Receipt, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SaleForm = {
  medicineId: string;
  quantity: string;
  patientName: string;
  saleDate: string;
};

const EMPTY_FORM: SaleForm = {
  medicineId: "",
  quantity: "",
  patientName: "",
  saleDate: new Date().toISOString().split("T")[0],
};

export function Sales() {
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: medicines } = useMedicines();
  const recordSale = useRecordSale();
  const [form, setForm] = useState<SaleForm>(EMPTY_FORM);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.medicineId) {
      toast.error("Please select a medicine");
      return;
    }
    const qty = Number.parseInt(form.quantity, 10);
    if (!qty || qty <= 0) {
      toast.error("Quantity must be a positive number");
      return;
    }
    try {
      const result = await recordSale.mutateAsync({
        medicineId: BigInt(form.medicineId),
        quantity: BigInt(qty),
        patientName: form.patientName.trim() || "Anonymous",
        saleDate: form.saleDate,
      });
      if (result) {
        toast.success(
          `Sale recorded — Total: $${result.totalPrice.toFixed(2)}`,
        );
        setForm({ ...EMPTY_FORM, saleDate: form.saleDate });
      } else {
        toast.error("Sale failed — check stock availability");
      }
    } catch {
      toast.error("Sale recording failed. Please try again.");
    }
  }

  const totalRevenue = (sales ?? []).reduce((acc, s) => acc + s.totalPrice, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-800 text-black tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          Sales Management
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 font-medium">
          Record new sales and view transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New Sale Form */}
        <div className="xl:col-span-1">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                Record New Sale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-[12px] font-700 text-black mb-1.5 block">
                    Medicine *
                  </Label>
                  <Select
                    value={form.medicineId}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, medicineId: v }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="sales.medicine.select"
                      className="text-black font-medium text-[13px]"
                    >
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {(medicines ?? []).map((m) => (
                        <SelectItem
                          key={m.id.toString()}
                          value={String(Number(m.id))}
                          className="font-medium text-black"
                        >
                          {m.name} {m.dosage} (Qty: {Number(m.quantity)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[12px] font-700 text-black mb-1.5 block">
                    Quantity *
                  </Label>
                  <Input
                    data-ocid="sales.quantity.input"
                    type="number"
                    min="1"
                    required
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                    placeholder="1"
                    className="text-black font-medium text-[13px]"
                  />
                </div>

                <div>
                  <Label className="text-[12px] font-700 text-black mb-1.5 block">
                    Patient Name
                  </Label>
                  <Input
                    data-ocid="sales.patient.input"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientName: e.target.value }))
                    }
                    placeholder="Patient name (optional)"
                    className="text-black font-medium text-[13px]"
                  />
                </div>

                <div>
                  <Label className="text-[12px] font-700 text-black mb-1.5 block">
                    Sale Date *
                  </Label>
                  <Input
                    data-ocid="sales.date.input"
                    type="date"
                    required
                    value={form.saleDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, saleDate: e.target.value }))
                    }
                    className="text-black font-medium text-[13px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={recordSale.isPending}
                  data-ocid="sales.submit_button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-700 gap-2 mt-2"
                >
                  {recordSale.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Record Sale
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-white border-slate-200 shadow-xs mt-4">
            <CardContent className="p-5">
              <p className="text-[11px] font-700 text-slate-500 uppercase tracking-wider mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-display font-800 text-black">
                $
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-[12px] text-slate-400 font-medium mt-1">
                From {sales?.length ?? 0} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales History Table */}
        <div className="xl:col-span-2">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-[15px] font-display font-700 text-black">
                Sales History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[600px]">
                <Table data-ocid="sales.table">
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      {[
                        "Medicine",
                        "Category",
                        "Qty",
                        "Unit Price",
                        "Total",
                        "Patient",
                        "Date",
                      ].map((h) => (
                        <TableHead
                          key={h}
                          className="pharma-table-header py-3 px-4 text-left"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesLoading ? (
                      Array.from({ length: 6 }, (_, i) => `row-${i}`).map(
                        (rowKey) => (
                          <TableRow key={rowKey}>
                            {Array.from(
                              { length: 7 },
                              (_, j) => `cell-${j}`,
                            ).map((cellKey) => (
                              <TableCell key={cellKey}>
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ),
                      )
                    ) : (sales ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div
                            data-ocid="sales.empty_state"
                            className="text-slate-400 font-medium"
                          >
                            No sales recorded yet.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...(sales ?? [])]
                        .sort((a, b) => b.saleDate.localeCompare(a.saleDate))
                        .map((s) => (
                          <TableRow
                            key={s.id.toString()}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <TableCell className="pharma-table-cell py-3 px-4 font-700 text-[13px]">
                              {s.medicineName}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                              {s.category}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700">
                              {Number(s.quantity)}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                              ${s.unitPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700 text-blue-700">
                              ${s.totalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                              {s.patientName || "—"}
                            </TableCell>
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                              {s.saleDate}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
