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
  useIsAdmin,
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

type FormData = {
  name: string;
  category: string;
  dosage: string;
  quantity: string;
  supplierId: string;
  unitPrice: string;
  expiryDate: string;
  isNearExpiry: boolean;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "Hypertension",
  dosage: "",
  quantity: "",
  supplierId: "",
  unitPrice: "",
  expiryDate: "",
  isNearExpiry: false,
};

export function Inventory() {
  const { data: medicines, isLoading } = useMedicines();
  const { data: suppliers } = useSuppliers();
  const { data: isAdmin } = useIsAdmin();
  const addMedicine = useAddMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const supplierName = (id: bigint) =>
    suppliers?.find((s) => s.id === id)?.name ?? `#${id}`;

  const filtered = (medicines ?? []).filter(
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
      unitPrice: String(m.unitPrice),
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
    const payload = {
      name: form.name.trim(),
      category: form.category,
      dosage: form.dosage.trim(),
      quantity: BigInt(Number.parseInt(form.quantity, 10) || 0),
      supplierId: BigInt(Number.parseInt(form.supplierId, 10) || 1),
      unitPrice: Number.parseFloat(form.unitPrice) || 0,
      expiryDate: form.expiryDate,
      isNearExpiry: form.isNearExpiry,
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
      toast.error("Operation failed. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMedicine.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" removed from inventory`);
    } catch {
      toast.error("Delete failed. Please try again.");
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
            <Pill className="w-6 h-6 text-blue-600" />
            Medicine Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {medicines?.length ?? 0} medicines registered
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            data-ocid="inventory.add_button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-700 text-[13px] gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-slate-300 text-black font-medium text-[13px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table data-ocid="inventory.table">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200">
              {[
                "Name",
                "Category",
                "Dosage",
                "Qty",
                "Unit Price",
                "Supplier",
                "Expiry",
                "Status",
                "Actions",
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
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => `row-${i}`).map((rowKey) => (
                <TableRow key={rowKey}>
                  {Array.from({ length: 9 }, (_, j) => `cell-${j}`).map(
                    (cellKey) => (
                      <TableCell key={cellKey}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
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
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="pharma-table-cell py-3 px-4 font-700 text-[13px]">
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
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                    {m.dosage}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px] font-700">
                    {Number(m.quantity)}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                    ${m.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                    {supplierName(m.supplierId)}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                    {m.expiryDate}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {m.isNearExpiry ? (
                      <Badge className="bg-red-100 text-red-700 border border-red-300 font-700 text-[11px] gap-1">
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
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          data-ocid={`inventory.edit_button.${idx + 1}`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          data-ocid={`inventory.delete_button.${idx + 1}`}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
                  <SelectTrigger className="text-black font-medium text-[13px]">
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
                  Unit Price (USD) *
                </Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.unitPrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unitPrice: e.target.value }))
                  }
                  placeholder="12.50"
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
                  checked={form.isNearExpiry}
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-700 gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Update Medicine" : "Add Medicine"}
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
                "{deleteTarget?.name} {deleteTarget?.dosage}"
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
