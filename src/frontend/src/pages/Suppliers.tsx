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
  useAddSupplier,
  useDeleteSupplier,
  useMedicines,
  useSuppliers,
  useUpdateSupplier,
} from "@/hooks/useQueries";
import {
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Pill,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Supplier } from "../backend.d";

// ── Static fallback ──────────────────────────────────────────────────────────
const STATIC_SUPPLIERS = [
  {
    id: 1n,
    name: "Ibn Sina",
    contact: JSON.stringify({
      phone: "+20-2-2345-6789",
      address: "Cairo, Egypt",
      email: "ibnsina@pharma.eg",
    }),
  },
  {
    id: 2n,
    name: "Pharma Overseas",
    contact: JSON.stringify({
      phone: "+44-20-7946-0958",
      address: "London, UK",
      email: "overseas@pharmaint.co.uk",
    }),
  },
  {
    id: 3n,
    name: "United Pharma",
    contact: JSON.stringify({
      phone: "+20-2-3456-7890",
      address: "Alexandria, Egypt",
      email: "info@unitedpharma.eg",
    }),
  },
  {
    id: 4n,
    name: "Al-Ezaby",
    contact: JSON.stringify({
      phone: "+20-2-4567-8901",
      address: "Giza, Egypt",
      email: "supply@alezaby.com",
    }),
  },
];

const STATIC_MEDICINES = [
  { id: 1n, name: "ConCor 2.5mg", supplierId: 1n },
  { id: 2n, name: "ConCor 5mg", supplierId: 1n },
  { id: 3n, name: "ErastaPex", supplierId: 2n },
  { id: 4n, name: "Augmentin 1g", supplierId: 3n },
  { id: 5n, name: "Glucophage", supplierId: 2n },
  { id: 6n, name: "Nexium", supplierId: 4n },
];

// ── Contact parsing/serialisation ─────────────────────────────────────────
interface ContactData {
  phone: string;
  address: string;
  email: string;
}

function parseContact(raw: string): ContactData {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        phone: parsed.phone ?? "",
        address: parsed.address ?? "",
        email: parsed.email ?? "",
      };
    }
  } catch {
    // legacy plain text — best-effort parse
  }
  return { phone: raw, address: "", email: "" };
}

function serializeContact(data: ContactData): string {
  return JSON.stringify(data);
}

// ── Types ─────────────────────────────────────────────────────────────────
interface SupplierForm {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const EMPTY_FORM: SupplierForm = {
  name: "",
  phone: "",
  address: "",
  email: "",
};

export function Suppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  const { data: medicines } = useMedicines();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierForm>(EMPTY_FORM);

  const displaySuppliers =
    suppliers && suppliers.length > 0 ? suppliers : STATIC_SUPPLIERS;
  const displayMedicines =
    medicines && medicines.length > 0 ? medicines : STATIC_MEDICINES;

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(s: Supplier) {
    setEditTarget(s);
    const c = parseContact(s.contact);
    setForm({
      name: s.name,
      phone: c.phone,
      address: c.address,
      email: c.email,
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
    const contact = serializeContact({
      phone: form.phone.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
    });
    const payload = { name: form.name.trim(), contact };
    try {
      if (editTarget) {
        await updateSupplier.mutateAsync({ id: editTarget.id, ...payload });
        toast.success(`"${payload.name}" updated successfully`);
      } else {
        await addSupplier.mutateAsync(payload);
        toast.success(`"${payload.name}" added as supplier`);
      }
      closeDialog();
    } catch {
      toast.error("Login as admin to manage data");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSupplier.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" removed from suppliers`);
    } catch {
      toast.error("Login as admin to manage data");
    } finally {
      setDeleteTarget(null);
    }
  }

  const isPending = addSupplier.isPending || updateSupplier.isPending;

  function getSuppliedMedicines(supplierId: bigint) {
    return displayMedicines
      .filter((m) => m.supplierId === supplierId)
      .map((m) => ("dosage" in m ? `${m.name}` : m.name))
      .slice(0, 3);
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-black" />
            Supplier Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {displaySuppliers.length} active suppliers
          </p>
        </div>
        <Button
          onClick={openAdd}
          data-ocid="suppliers.add_button"
          className="bg-black hover:bg-zinc-800 text-white font-700 text-[13px] gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table data-ocid="suppliers.table">
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                {[
                  "#",
                  "Supplier Name",
                  "Phone",
                  "Email",
                  "Address",
                  "Supplied Medicines",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="py-3 px-4 text-left text-[11px] font-800 text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }, (_, i) => `row-${i}`).map(
                  (rowKey) => (
                    <TableRow key={rowKey}>
                      {Array.from({ length: 7 }, (_, j) => `cell-${j}`).map(
                        (cellKey) => (
                          <TableCell key={cellKey}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ),
                )
              ) : displaySuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div
                      data-ocid="suppliers.empty_state"
                      className="text-slate-400 font-medium"
                    >
                      No suppliers found.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displaySuppliers.map((s, idx) => {
                  const contact = parseContact(s.contact);
                  const suppliedMeds = getSuppliedMedicines(s.id);
                  return (
                    <TableRow
                      key={s.id.toString()}
                      data-ocid={`suppliers.item.${idx + 1}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="py-3 px-4 text-[13px] text-slate-400 font-medium w-10">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-3 px-4 font-700 text-black text-[13px] whitespace-nowrap">
                        {s.name}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-[12px] text-slate-600 whitespace-nowrap">
                        {contact.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {contact.phone}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-[12px] text-slate-600 whitespace-nowrap">
                        {contact.email ? (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {contact.email}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-[12px] text-slate-600">
                        {contact.address ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {contact.address}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {suppliedMeds.length > 0 ? (
                            suppliedMeds.map((m) => (
                              <Badge
                                key={m}
                                variant="outline"
                                className="text-[10px] font-600 border-slate-300 text-black px-1.5 py-0.5 flex items-center gap-0.5"
                              >
                                <Pill className="w-2.5 h-2.5" />
                                {m}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[12px] text-slate-300">
                              —
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(s as Supplier)}
                            data-ocid={`suppliers.edit_button.${idx + 1}`}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(s as Supplier)}
                            data-ocid={`suppliers.delete_button.${idx + 1}`}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
          data-ocid="suppliers.dialog"
          className="max-w-lg bg-white"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-[16px] font-display font-700 text-black">
              {editTarget ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[13px]">
              {editTarget
                ? "Update supplier details."
                : "Fill in the supplier information."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label className="text-[12px] font-700 text-black mb-1.5 block">
                Supplier Name *
              </Label>
              <Input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g., Ibn Sina Pharma"
                data-ocid="suppliers.name.input"
                className="text-black font-medium text-[13px]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Phone
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+20-2-1234-5678"
                  data-ocid="suppliers.phone.input"
                  className="text-black font-medium text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[12px] font-700 text-black mb-1.5 block">
                  Email
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="supplier@example.com"
                  data-ocid="suppliers.email.input"
                  className="text-black font-medium text-[13px]"
                />
              </div>
            </div>
            <div>
              <Label className="text-[12px] font-700 text-black mb-1.5 block">
                Address
              </Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="City, Country"
                data-ocid="suppliers.address.input"
                className="text-black font-medium text-[13px]"
              />
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                data-ocid="suppliers.cancel_button"
                className="font-700 text-black border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="suppliers.submit_button"
                className="bg-black hover:bg-zinc-800 text-white font-700 gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Save Changes" : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
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
              Are you sure you want to remove{" "}
              <span className="font-700 text-black">
                &quot;{deleteTarget?.name}&quot;
              </span>{" "}
              from suppliers?
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
              disabled={deleteSupplier.isPending}
            >
              {deleteSupplier.isPending && (
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
