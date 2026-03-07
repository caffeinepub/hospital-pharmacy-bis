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
  useIsAdmin,
  useSuppliers,
  useUpdateSupplier,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Supplier } from "../backend.d";

type SupplierForm = { name: string; contact: string };
const EMPTY_FORM: SupplierForm = { name: "", contact: "" };

export function Suppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  const { data: isAdmin } = useIsAdmin();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierForm>(EMPTY_FORM);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(s: Supplier) {
    setEditTarget(s);
    setForm({ name: s.name, contact: s.contact });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: form.name.trim(), contact: form.contact.trim() };
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
      toast.error("Operation failed. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSupplier.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" removed from suppliers`);
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }

  const isPending = addSupplier.isPending || updateSupplier.isPending;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Supplier Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {suppliers?.length ?? 0} active suppliers
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            data-ocid="suppliers.add_button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-700 text-[13px] gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table data-ocid="suppliers.table">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200">
              {["#", "Supplier Name", "Contact", "Actions"].map((h) => (
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
              Array.from({ length: 4 }, (_, i) => `row-${i}`).map((rowKey) => (
                <TableRow key={rowKey}>
                  {Array.from({ length: 4 }, (_, j) => `cell-${j}`).map(
                    (cellKey) => (
                      <TableCell key={cellKey}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (suppliers ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div
                    data-ocid="suppliers.empty_state"
                    className="text-slate-400 font-medium"
                  >
                    No suppliers found.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (suppliers ?? []).map((s, idx) => (
                <TableRow
                  key={s.id.toString()}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px] w-12">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 font-700 text-[13px]">
                    {s.name}
                  </TableCell>
                  <TableCell className="pharma-table-cell py-3 px-4 text-[13px]">
                    {s.contact}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          data-ocid={`suppliers.edit_button.${idx + 1}`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          data-ocid={`suppliers.delete_button.${idx + 1}`}
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
          data-ocid="suppliers.dialog"
          className="max-w-md bg-white"
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
                className="text-black font-medium text-[13px]"
              />
            </div>
            <div>
              <Label className="text-[12px] font-700 text-black mb-1.5 block">
                Contact
              </Label>
              <Input
                value={form.contact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
                placeholder="Phone, email or address"
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-700 gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Update Supplier" : "Add Supplier"}
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
              Are you sure you want to remove{" "}
              <span className="font-700 text-black">
                "{deleteTarget?.name}"
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
