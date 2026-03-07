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

// ── Static fallback: 50 sales from Jan–Mar 2026, always visible ──
const STATIC_SALES = [
  {
    id: 1n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 15.5,
    totalPrice: 31.0,
    patientName: "Ahmed Hassan",
    saleDate: "2026-01-03",
  },
  {
    id: 2n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 5.5,
    totalPrice: 16.5,
    patientName: "Fatima Ali",
    saleDate: "2026-01-05",
  },
  {
    id: 3n,
    medicineId: 1n,
    medicineName: "ConCor 2.5mg",
    category: "Hypertension",
    quantity: 1n,
    unitPrice: 4.5,
    totalPrice: 4.5,
    patientName: "Mohamed Samir",
    saleDate: "2026-01-06",
  },
  {
    id: 4n,
    medicineId: 8n,
    medicineName: "Tavanic 500mg",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 18.0,
    totalPrice: 36.0,
    patientName: "Sara Khalil",
    saleDate: "2026-01-08",
  },
  {
    id: 5n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 2n,
    unitPrice: 9.5,
    totalPrice: 19.0,
    patientName: "Omar Farouk",
    saleDate: "2026-01-10",
  },
  {
    id: 6n,
    medicineId: 16n,
    medicineName: "Controloc 40mg",
    category: "Ulcer & Others",
    quantity: 1n,
    unitPrice: 9.25,
    totalPrice: 9.25,
    patientName: "Layla Nasser",
    saleDate: "2026-01-12",
  },
  {
    id: 7n,
    medicineId: 14n,
    medicineName: "Glucophage 1000mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 8.0,
    totalPrice: 24.0,
    patientName: "Karim Adel",
    saleDate: "2026-01-14",
  },
  {
    id: 8n,
    medicineId: 7n,
    medicineName: "SupraX 400mg",
    category: "Antibiotics",
    quantity: 1n,
    unitPrice: 12.0,
    totalPrice: 12.0,
    patientName: "Nour Ibrahim",
    saleDate: "2026-01-15",
  },
  {
    id: 9n,
    medicineId: 3n,
    medicineName: "ConCor 10mg",
    category: "Hypertension",
    quantity: 2n,
    unitPrice: 7.2,
    totalPrice: 14.4,
    patientName: "Hana Mostafa",
    saleDate: "2026-01-17",
  },
  {
    id: 10n,
    medicineId: 17n,
    medicineName: "Nexium 40mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 11.5,
    totalPrice: 23.0,
    patientName: "Tarek Saleh",
    saleDate: "2026-01-19",
  },
  {
    id: 11n,
    medicineId: 12n,
    medicineName: "Amaryl 2mg",
    category: "Diabetes",
    quantity: 1n,
    unitPrice: 12.0,
    totalPrice: 12.0,
    patientName: "Rana Mahmoud",
    saleDate: "2026-01-21",
  },
  {
    id: 12n,
    medicineId: 5n,
    medicineName: "ErastaPex 40mg",
    category: "Hypertension",
    quantity: 2n,
    unitPrice: 11.0,
    totalPrice: 22.0,
    patientName: "Youssef Amr",
    saleDate: "2026-01-22",
  },
  {
    id: 13n,
    medicineId: 20n,
    medicineName: "Crestor 10mg",
    category: "Ulcer & Others",
    quantity: 1n,
    unitPrice: 14.0,
    totalPrice: 14.0,
    patientName: "Dina Sami",
    saleDate: "2026-01-24",
  },
  {
    id: 14n,
    medicineId: 9n,
    medicineName: "Ceftriaxone 1g",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 22.5,
    totalPrice: 45.0,
    patientName: "Walid Fathy",
    saleDate: "2026-01-25",
  },
  {
    id: 15n,
    medicineId: 15n,
    medicineName: "Galvus Met 50/1000mg",
    category: "Diabetes",
    quantity: 1n,
    unitPrice: 24.0,
    totalPrice: 24.0,
    patientName: "Mona Zaki",
    saleDate: "2026-01-27",
  },
  {
    id: 16n,
    medicineId: 18n,
    medicineName: "Pantoloc 20mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 7.8,
    totalPrice: 15.6,
    patientName: "Khaled Gamal",
    saleDate: "2026-01-29",
  },
  {
    id: 17n,
    medicineId: 2n,
    medicineName: "ConCor 5mg",
    category: "Hypertension",
    quantity: 1n,
    unitPrice: 5.75,
    totalPrice: 5.75,
    patientName: "Amira Hossam",
    saleDate: "2026-01-31",
  },
  {
    id: 18n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 3n,
    unitPrice: 15.5,
    totalPrice: 46.5,
    patientName: "Hassan Youssef",
    saleDate: "2026-02-02",
  },
  {
    id: 19n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 2n,
    unitPrice: 5.5,
    totalPrice: 11.0,
    patientName: "Nadia Hamid",
    saleDate: "2026-02-03",
  },
  {
    id: 20n,
    medicineId: 10n,
    medicineName: "Flagyl 500mg",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 6.75,
    totalPrice: 13.5,
    patientName: "Sherif Taha",
    saleDate: "2026-02-05",
  },
  {
    id: 21n,
    medicineId: 4n,
    medicineName: "ErastaPex 20mg",
    category: "Hypertension",
    quantity: 1n,
    unitPrice: 8.5,
    totalPrice: 8.5,
    patientName: "Ghada Shawky",
    saleDate: "2026-02-07",
  },
  {
    id: 22n,
    medicineId: 14n,
    medicineName: "Glucophage 1000mg",
    category: "Diabetes",
    quantity: 4n,
    unitPrice: 8.0,
    totalPrice: 32.0,
    patientName: "Bassem Ragab",
    saleDate: "2026-02-08",
  },
  {
    id: 23n,
    medicineId: 7n,
    medicineName: "SupraX 400mg",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 12.0,
    totalPrice: 24.0,
    patientName: "Samira Lotfy",
    saleDate: "2026-02-10",
  },
  {
    id: 24n,
    medicineId: 19n,
    medicineName: "Ator 20mg",
    category: "Ulcer & Others",
    quantity: 1n,
    unitPrice: 8.5,
    totalPrice: 8.5,
    patientName: "Essam Fouad",
    saleDate: "2026-02-12",
  },
  {
    id: 25n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 9.5,
    totalPrice: 28.5,
    patientName: "Abeer Magdy",
    saleDate: "2026-02-13",
  },
  {
    id: 26n,
    medicineId: 16n,
    medicineName: "Controloc 40mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 9.25,
    totalPrice: 18.5,
    patientName: "Randa Ezzat",
    saleDate: "2026-02-15",
  },
  {
    id: 27n,
    medicineId: 8n,
    medicineName: "Tavanic 500mg",
    category: "Antibiotics",
    quantity: 1n,
    unitPrice: 18.0,
    totalPrice: 18.0,
    patientName: "Mahmoud Atef",
    saleDate: "2026-02-17",
  },
  {
    id: 28n,
    medicineId: 3n,
    medicineName: "ConCor 10mg",
    category: "Hypertension",
    quantity: 2n,
    unitPrice: 7.2,
    totalPrice: 14.4,
    patientName: "Iman Barakat",
    saleDate: "2026-02-19",
  },
  {
    id: 29n,
    medicineId: 21n,
    medicineName: "Aspirin 100mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 2.5,
    totalPrice: 5.0,
    patientName: "Fady Wahba",
    saleDate: "2026-02-20",
  },
  {
    id: 30n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 15.5,
    totalPrice: 31.0,
    patientName: "Lamia Sobhy",
    saleDate: "2026-02-22",
  },
  {
    id: 31n,
    medicineId: 15n,
    medicineName: "Galvus Met 50/1000mg",
    category: "Diabetes",
    quantity: 1n,
    unitPrice: 24.0,
    totalPrice: 24.0,
    patientName: "Sherif Helmy",
    saleDate: "2026-02-24",
  },
  {
    id: 32n,
    medicineId: 12n,
    medicineName: "Amaryl 2mg",
    category: "Diabetes",
    quantity: 2n,
    unitPrice: 12.0,
    totalPrice: 24.0,
    patientName: "Heba Mansour",
    saleDate: "2026-02-25",
  },
  {
    id: 33n,
    medicineId: 5n,
    medicineName: "ErastaPex 40mg",
    category: "Hypertension",
    quantity: 1n,
    unitPrice: 11.0,
    totalPrice: 11.0,
    patientName: "Amr Osman",
    saleDate: "2026-02-27",
  },
  {
    id: 34n,
    medicineId: 23n,
    medicineName: "Metformin 850mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 4.75,
    totalPrice: 14.25,
    patientName: "Noha Salem",
    saleDate: "2026-02-28",
  },
  {
    id: 35n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 3n,
    unitPrice: 15.5,
    totalPrice: 46.5,
    patientName: "Ibrahim Badr",
    saleDate: "2026-03-01",
  },
  {
    id: 36n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 4n,
    unitPrice: 5.5,
    totalPrice: 22.0,
    patientName: "Yasmine Salama",
    saleDate: "2026-03-03",
  },
  {
    id: 37n,
    medicineId: 14n,
    medicineName: "Glucophage 1000mg",
    category: "Diabetes",
    quantity: 2n,
    unitPrice: 8.0,
    totalPrice: 16.0,
    patientName: "Mostafa Emad",
    saleDate: "2026-03-05",
  },
  {
    id: 38n,
    medicineId: 7n,
    medicineName: "SupraX 400mg",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 12.0,
    totalPrice: 24.0,
    patientName: "Doaa Abdel",
    saleDate: "2026-03-07",
  },
  {
    id: 39n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 9.5,
    totalPrice: 28.5,
    patientName: "Samir Naguib",
    saleDate: "2026-03-08",
  },
  {
    id: 40n,
    medicineId: 4n,
    medicineName: "ErastaPex 20mg",
    category: "Hypertension",
    quantity: 2n,
    unitPrice: 8.5,
    totalPrice: 17.0,
    patientName: "Hanan Gohar",
    saleDate: "2026-03-10",
  },
  {
    id: 41n,
    medicineId: 8n,
    medicineName: "Tavanic 500mg",
    category: "Antibiotics",
    quantity: 1n,
    unitPrice: 18.0,
    totalPrice: 18.0,
    patientName: "Wael Diab",
    saleDate: "2026-03-12",
  },
  {
    id: 42n,
    medicineId: 16n,
    medicineName: "Controloc 40mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 9.25,
    totalPrice: 18.5,
    patientName: "Mariam Fawzi",
    saleDate: "2026-03-13",
  },
  {
    id: 43n,
    medicineId: 19n,
    medicineName: "Ator 20mg",
    category: "Ulcer & Others",
    quantity: 2n,
    unitPrice: 8.5,
    totalPrice: 17.0,
    patientName: "Tamer Badawi",
    saleDate: "2026-03-15",
  },
  {
    id: 44n,
    medicineId: 2n,
    medicineName: "ConCor 5mg",
    category: "Hypertension",
    quantity: 1n,
    unitPrice: 5.75,
    totalPrice: 5.75,
    patientName: "Shady Anis",
    saleDate: "2026-03-17",
  },
  {
    id: 45n,
    medicineId: 22n,
    medicineName: "Bisoprolol 5mg",
    category: "Hypertension",
    quantity: 2n,
    unitPrice: 6.0,
    totalPrice: 12.0,
    patientName: "Reem Soliman",
    saleDate: "2026-03-18",
  },
  {
    id: 46n,
    medicineId: 9n,
    medicineName: "Ceftriaxone 1g",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 22.5,
    totalPrice: 45.0,
    patientName: "Amgad Khalaf",
    saleDate: "2026-03-20",
  },
  {
    id: 47n,
    medicineId: 17n,
    medicineName: "Nexium 40mg",
    category: "Ulcer & Others",
    quantity: 1n,
    unitPrice: 11.5,
    totalPrice: 11.5,
    patientName: "Nagwa Rashad",
    saleDate: "2026-03-21",
  },
  {
    id: 48n,
    medicineId: 24n,
    medicineName: "Omeprazole 20mg",
    category: "Ulcer & Others",
    quantity: 3n,
    unitPrice: 3.8,
    totalPrice: 11.4,
    patientName: "Osama Tantawi",
    saleDate: "2026-03-23",
  },
  {
    id: 49n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 2n,
    unitPrice: 15.5,
    totalPrice: 31.0,
    patientName: "Aya Fouad",
    saleDate: "2026-03-25",
  },
  {
    id: 50n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 3n,
    unitPrice: 5.5,
    totalPrice: 16.5,
    patientName: "Hazem Lotfy",
    saleDate: "2026-03-27",
  },
];

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

  // Use backend data if available, else static fallback
  const displaySales = sales && sales.length > 0 ? sales : STATIC_SALES;
  const totalRevenue = displaySales.reduce((acc, s) => acc + s.totalPrice, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-800 text-black tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-black" />
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
                <Receipt className="w-4 h-4 text-black" />
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
                  className="w-full bg-black hover:bg-zinc-800 text-white font-700 gap-2 mt-2"
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
                From {displaySales.length} transactions
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
                    ) : displaySales.length === 0 ? (
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
                      [...displaySales]
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
                            <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700 text-black">
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
