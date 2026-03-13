import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useAddMedicine,
  useDeleteMedicine,
  useMedicines,
  useSuppliers,
  useUpdateMedicine,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  Loader2,
  Pencil,
  Pill,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Medicine } from "../backend.d";

const CATEGORIES = [
  "Hypertension",
  "Antibiotics",
  "Diabetes",
  "Ulcer & Others",
];

// ── Static fallback: always shown when backend returns empty ──
const STATIC_MEDICINES = [
  {
    id: 1n,
    name: "ConCor",
    category: "Hypertension",
    dosage: "2.5mg",
    quantity: 200n,
    supplierId: 1n,
    purchasePrice: 3.15,
    salePrice: 4.5,
    expiryDate: "2027-01-15",
    isNearExpiry: false,
  },
  {
    id: 2n,
    name: "ConCor",
    category: "Hypertension",
    dosage: "5mg",
    quantity: 150n,
    supplierId: 1n,
    purchasePrice: 4.03,
    salePrice: 5.75,
    expiryDate: "2026-04-01",
    isNearExpiry: true,
  },
  {
    id: 3n,
    name: "ConCor",
    category: "Hypertension",
    dosage: "10mg",
    quantity: 180n,
    supplierId: 1n,
    purchasePrice: 5.04,
    salePrice: 7.2,
    expiryDate: "2026-12-20",
    isNearExpiry: false,
  },
  {
    id: 4n,
    name: "ErastaPex",
    category: "Hypertension",
    dosage: "20mg",
    quantity: 120n,
    supplierId: 2n,
    purchasePrice: 5.95,
    salePrice: 8.5,
    expiryDate: "2027-03-10",
    isNearExpiry: false,
  },
  {
    id: 5n,
    name: "ErastaPex",
    category: "Hypertension",
    dosage: "40mg",
    quantity: 100n,
    supplierId: 2n,
    purchasePrice: 7.7,
    salePrice: 11.0,
    expiryDate: "2027-06-30",
    isNearExpiry: false,
  },
  {
    id: 6n,
    name: "Augmentin",
    category: "Antibiotics",
    dosage: "1g",
    quantity: 90n,
    supplierId: 3n,
    purchasePrice: 10.85,
    salePrice: 15.5,
    expiryDate: "2026-04-05",
    isNearExpiry: true,
  },
  {
    id: 7n,
    name: "SupraX",
    category: "Antibiotics",
    dosage: "400mg",
    quantity: 110n,
    supplierId: 3n,
    purchasePrice: 8.4,
    salePrice: 12.0,
    expiryDate: "2027-02-28",
    isNearExpiry: false,
  },
  {
    id: 8n,
    name: "Tavanic",
    category: "Antibiotics",
    dosage: "500mg",
    quantity: 80n,
    supplierId: 3n,
    purchasePrice: 12.6,
    salePrice: 18.0,
    expiryDate: "2026-11-15",
    isNearExpiry: false,
  },
  {
    id: 9n,
    name: "Ceftriaxone",
    category: "Antibiotics",
    dosage: "1g",
    quantity: 60n,
    supplierId: 3n,
    purchasePrice: 15.75,
    salePrice: 22.5,
    expiryDate: "2027-01-20",
    isNearExpiry: false,
  },
  {
    id: 10n,
    name: "Flagyl",
    category: "Antibiotics",
    dosage: "500mg",
    quantity: 130n,
    supplierId: 4n,
    purchasePrice: 4.73,
    salePrice: 6.75,
    expiryDate: "2026-10-31",
    isNearExpiry: false,
  },
  {
    id: 11n,
    name: "Amaryl",
    category: "Diabetes",
    dosage: "1mg",
    quantity: 200n,
    supplierId: 2n,
    purchasePrice: 6.65,
    salePrice: 9.5,
    expiryDate: "2027-04-15",
    isNearExpiry: false,
  },
  {
    id: 12n,
    name: "Amaryl",
    category: "Diabetes",
    dosage: "2mg",
    quantity: 180n,
    supplierId: 2n,
    purchasePrice: 8.4,
    salePrice: 12.0,
    expiryDate: "2027-04-15",
    isNearExpiry: false,
  },
  {
    id: 13n,
    name: "Glucophage",
    category: "Diabetes",
    dosage: "500mg",
    quantity: 250n,
    supplierId: 4n,
    purchasePrice: 3.85,
    salePrice: 5.5,
    expiryDate: "2027-08-20",
    isNearExpiry: false,
  },
  {
    id: 14n,
    name: "Glucophage",
    category: "Diabetes",
    dosage: "1000mg",
    quantity: 220n,
    supplierId: 4n,
    purchasePrice: 5.6,
    salePrice: 8.0,
    expiryDate: "2027-08-20",
    isNearExpiry: false,
  },
  {
    id: 15n,
    name: "Galvus Met",
    category: "Diabetes",
    dosage: "50/1000mg",
    quantity: 90n,
    supplierId: 2n,
    purchasePrice: 16.8,
    salePrice: 24.0,
    expiryDate: "2026-09-30",
    isNearExpiry: false,
  },
  {
    id: 16n,
    name: "Controloc",
    category: "Ulcer & Others",
    dosage: "40mg",
    quantity: 160n,
    supplierId: 1n,
    purchasePrice: 6.48,
    salePrice: 9.25,
    expiryDate: "2027-05-10",
    isNearExpiry: false,
  },
  {
    id: 17n,
    name: "Nexium",
    category: "Ulcer & Others",
    dosage: "40mg",
    quantity: 140n,
    supplierId: 2n,
    purchasePrice: 8.05,
    salePrice: 11.5,
    expiryDate: "2027-07-22",
    isNearExpiry: false,
  },
  {
    id: 18n,
    name: "Pantoloc",
    category: "Ulcer & Others",
    dosage: "20mg",
    quantity: 120n,
    supplierId: 3n,
    purchasePrice: 5.46,
    salePrice: 7.8,
    expiryDate: "2026-12-05",
    isNearExpiry: false,
  },
  {
    id: 19n,
    name: "Ator",
    category: "Ulcer & Others",
    dosage: "20mg",
    quantity: 100n,
    supplierId: 4n,
    purchasePrice: 5.95,
    salePrice: 8.5,
    expiryDate: "2027-02-14",
    isNearExpiry: false,
  },
  {
    id: 20n,
    name: "Crestor",
    category: "Ulcer & Others",
    dosage: "10mg",
    quantity: 110n,
    supplierId: 1n,
    purchasePrice: 9.8,
    salePrice: 14.0,
    expiryDate: "2027-09-18",
    isNearExpiry: false,
  },
  {
    id: 21n,
    name: "Aspirin",
    category: "Ulcer & Others",
    dosage: "100mg",
    quantity: 300n,
    supplierId: 4n,
    purchasePrice: 1.75,
    salePrice: 2.5,
    expiryDate: "2027-11-30",
    isNearExpiry: false,
  },
  {
    id: 22n,
    name: "Bisoprolol",
    category: "Hypertension",
    dosage: "5mg",
    quantity: 150n,
    supplierId: 2n,
    purchasePrice: 4.2,
    salePrice: 6.0,
    expiryDate: "2027-01-25",
    isNearExpiry: false,
  },
  {
    id: 23n,
    name: "Metformin",
    category: "Diabetes",
    dosage: "850mg",
    quantity: 200n,
    supplierId: 3n,
    purchasePrice: 3.33,
    salePrice: 4.75,
    expiryDate: "2027-06-10",
    isNearExpiry: false,
  },
  {
    id: 24n,
    name: "Omeprazole",
    category: "Ulcer & Others",
    dosage: "20mg",
    quantity: 180n,
    supplierId: 4n,
    purchasePrice: 2.66,
    salePrice: 3.8,
    expiryDate: "2027-10-05",
    isNearExpiry: false,
  },
];

const STATIC_SUPPLIER_MAP: Record<string, string> = {
  "1": "Ibn Sina",
  "2": "Pharma Overseas",
  "3": "United Pharma",
  "4": "Al-Ezaby",
};

type FormData = {
  name: string;
  category: string;
  dosage: string;
  quantity: string;
  supplierId: string;
  purchasePrice: string;
  salePrice: string;
  expiryDate: string;
  isNearExpiry: boolean;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "Hypertension",
  dosage: "",
  quantity: "",
  supplierId: "",
  purchasePrice: "",
  salePrice: "",
  expiryDate: "",
  isNearExpiry: false,
};

function isNearExpiryDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const today = new Date();
  const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}

export function Inventory() {
  const { data: medicines, isLoading } = useMedicines();
  const { data: suppliers } = useSuppliers();
  const addMedicine = useAddMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [search, setSearch] = useState("");

  // Use backend data if available, else static fallback
  const displayMedicines =
    medicines && medicines.length > 0 ? medicines : STATIC_MEDICINES;

  const supplierName = (id: bigint) =>
    suppliers?.find((s) => s.id === id)?.name ??
    STATIC_SUPPLIER_MAP[String(Number(id))] ??
    `#${id}`;

  const filtered = displayMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(m: Medicine) {
    setEditTarget(m);
    setForm({
      name: m.name,
      category: m.category,
      dosage: m.dosage,
      quantity: String(Number(m.quantity)),
      supplierId: String(Number(m.supplierId)),
      purchasePrice: String(m.purchasePrice),
      salePrice: String(m.salePrice),
      expiryDate: m.expiryDate,
      isNearExpiry: m.isNearExpiry,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const autoNearExpiry = isNearExpiryDate(form.expiryDate);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      dosage: form.dosage.trim(),
      quantity: BigInt(Number.parseInt(form.quantity, 10) || 0),
      supplierId: BigInt(Number.parseInt(form.supplierId, 10) || 1),
      purchasePrice: Number.parseFloat(form.purchasePrice) || 0,
      salePrice: Number.parseFloat(form.salePrice) || 0,
      expiryDate: form.expiryDate,
      isNearExpiry: form.isNearExpiry || autoNearExpiry,
    };

    try {
      if (editTarget) {
        await updateMedicine.mutateAsync({ id: editTarget.id, ...payload });
        toast.success(`"${payload.name}" updated successfully`);
      } else {
        await addMedicine.mutateAsync(payload);
        toast.success(`"${payload.name}" added to inventory`);
      }
      closeDialog();
    } catch {
      toast.error("Login as admin to manage data");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMedicine.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" removed from inventory`);
    } catch {
      toast.error("Login as admin to manage data");
    } finally {
      setDeleteTarget(null);
    }
  }

  const isPending = addMedicine.isPending || updateMedicine.isPending;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-black" />
            Medicine Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {displayMedicines.length} medicines registered
          </p>
        </div>
        <Button
          onClick={openAdd}
          data-ocid="inventory.add_button"
          className="bg-black hover:bg-zinc-800 text-white font-700 text-[13px] gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="inventory.search_input"
          className="border-slate-300 text-black font-medium text-[13px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table data-ocid="inventory.table">
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                {[
                  "Name",
                  "Category",
                  "Dosage",
                  "Qty",
                  "Purchase Price",
                  "Sale Price",
                  "Supplier",
                  "Expiry",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="pharma-table-header py-3 px-4 text-left whitespace-nowrap"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => `row-${i}`).map(
                  (rowKey) => (
                    <TableRow key={rowKey}>
                      {Array.from({ length: 10 }, (_, j) => `cell-${j}`).map(
                        (cellKey) => (
                          <TableCell key={cellKey}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ),
                )
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10">
                    <div
                      data-ocid="inventory.empty_state"
                      className="text-slate-400 font-medium"
                    >
                      No medicines found.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m, idx) => (
                  <TableRow
                    key={m.id.toString()}
                    data-ocid={`inventory.item.${idx + 1}`}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="pharma-table-cell py-3 px-4 font-700 text-[13px] whitespace-nowrap">
                      {m.name}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                      <Badge
                        variant="outline"
                        className="text-[11px] font-700 border-slate-300 text-black"
                      >
                        {m.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] whitespace-nowrap">
                      {m.dosage}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700">
                      {Number(m.quantity)}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] whitespace-nowrap">
                      ${m.purchasePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700 whitespace-nowrap">
                      ${m.salePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] whitespace-nowrap">
                      {supplierName(m.supplierId)}
                    </TableCell>
                    <TableCell className="pharma-table-cell py-3 px-4 text-[13px] whitespace-nowrap">
                      {m.expiryDate}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {m.isNearExpiry ? (
                        <Badge className="bg-red-100 text-red-700 border border-red-300 font-700 text-[11px] gap-1 whitespace-nowrap">
                          <AlertTriangle className="w-3 h-3" />
                          Near Expiry
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-700 text-[11px]">
                          OK
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(m as Medicine)}
                          data-ocid={`inventory.edit_button.${idx + 1}`}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m as Medicine)}
                          data-ocid={`inventory.delete_button.${idx + 1}`}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent
          data-ocid="inventory.medicine.dialog"
          className="max-w-lg bg-white"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-[16px] font-display font-700 text-black">
              {editTarget ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[13px]">
              {editTarget
                ? "Update medicine details."
                : "Fill in the medicine details below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Medicine Name *
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g., Augmentin"
                  data-ocid="inventory.medicine.input"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Category *
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    data-ocid="inventory.medicine.select"
                    className="text-black font-medium text-[13px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-medium text-black"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Dosage *
                </Label>
                <Input
                  required
                  value={form.dosage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dosage: e.target.value }))
                  }
                  placeholder="e.g., 500mg"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Quantity *
                </Label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  placeholder="100"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Supplier
                </Label>
                <Select
                  value={form.supplierId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, supplierId: v }))
                  }
                >
                  <SelectTrigger className="text-black font-medium text-[13px]">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {(suppliers ?? []).map((s) => (
                      <SelectItem
                        key={s.id.toString()}
                        value={String(Number(s.id))}
                        className="font-medium text-black"
                      >
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Purchase Price (USD) *
                </Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.purchasePrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, purchasePrice: e.target.value }))
                  }
                  placeholder="8.50"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Sale Price (USD) *
                </Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.salePrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, salePrice: e.target.value }))
                  }
                  placeholder="12.50"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Expiry Date *
                </Label>
                <Input
                  required
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="nearExpiry"
                  checked={
                    form.isNearExpiry || isNearExpiryDate(form.expiryDate)
                  }
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isNearExpiry: e.target.checked }))
                  }
                  className="w-4 h-4 accent-red-600"
                />
                <Label
                  htmlFor="nearExpiry"
                  className="text-[13px] font-700 text-black cursor-pointer"
                >
                  Mark as Near Expiry
                  {isNearExpiryDate(form.expiryDate) && (
                    <span className="text-red-500 ml-1 text-[11px]">
                      (auto-detected)
                    </span>
                  )}
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                data-ocid="inventory.medicine.cancel_button"
                className="font-700 text-black border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="inventory.medicine.submit_button"
                className="bg-black hover:bg-zinc-800 text-white font-700 gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Save Changes" : "Add Medicine"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px] font-display font-700 text-black">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-[13px] font-medium">
              Are you sure you want to delete{" "}
              <span className="font-700 text-black">
                &quot;{deleteTarget?.name} {deleteTarget?.dosage}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="confirm.cancel_button"
              className="font-700 text-black border-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="confirm.delete_button"
              className="bg-red-600 hover:bg-red-700 text-white font-700"
              disabled={deleteMedicine.isPending}
            >
              {deleteMedicine.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
