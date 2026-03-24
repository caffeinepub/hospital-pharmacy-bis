import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { type Supplier, usePharmacy } from "../contexts/PharmacyStore";

const EMPTY_FORM = {
  name: "",
  contact: "",
  email: "",
  suppliedMedicinesText: "",
};

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    usePharmacy();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  }

  function openEdit(s: Supplier) {
    setEditId(s.id);
    setForm({
      name: s.name,
      contact: s.contact,
      email: s.email,
      suppliedMedicinesText: s.suppliedMedicines.join(", "),
    });
    setFormError("");
    setDialogOpen(true);
  }

  function handleSave() {
    const { name, contact, email, suppliedMedicinesText } = form;
    if (!name.trim() || !contact.trim() || !email.trim()) {
      setFormError("Name, contact, and email are required.");
      return;
    }
    const suppliedMedicines = suppliedMedicinesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editId) {
      updateSupplier(editId, {
        name: name.trim(),
        contact,
        email,
        suppliedMedicines,
      });
      toast.success("Supplier updated successfully");
    } else {
      const error = addSupplier({
        name: name.trim(),
        contact,
        email,
        suppliedMedicines,
      });
      if (error) {
        setFormError(error);
        return;
      }
      toast.success("Supplier added successfully");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteSupplier(id);
    setDeleteConfirmId(null);
    toast.success("Supplier deleted successfully");
  }

  return (
    <div className="p-4 md:p-6 space-y-5 md:ml-0 ml-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black font-display">
            Suppliers
          </h1>
          <p className="text-sm text-gray-500 font-semibold">
            {suppliers.length} suppliers
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            className="bg-black text-white hover:bg-gray-900 font-bold"
            data-ocid="suppliers.add_supplier.button"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Supplier
          </Button>
        )}
      </div>

      <Input
        placeholder="Search suppliers…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm border-gray-300 text-black font-semibold"
        data-ocid="suppliers.search_input"
      />

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Name
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Contact
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Email
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Supplied Medicines
                </TableHead>
                {isAdmin && (
                  <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s, i) => (
                <TableRow
                  key={s.id}
                  className="border-b border-gray-100"
                  data-ocid={`suppliers.supplier.row.${i + 1}`}
                >
                  <TableCell className="font-bold text-black">
                    {s.name}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.contact}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.suppliedMedicines.map((med) => (
                        <Badge
                          key={med}
                          variant="outline"
                          className="text-[10px] font-bold text-black border-gray-300 bg-gray-50"
                        >
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                          data-ocid={`suppliers.supplier.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          data-ocid={`suppliers.supplier.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 5 : 4}
                    className="text-center py-8 text-gray-400 font-semibold"
                    data-ocid="suppliers.empty_state"
                  >
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-white border-gray-200 max-w-lg"
          data-ocid="suppliers.supplier.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              {editId ? "Edit Supplier" : "Add Supplier"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {formError && (
              <p
                className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                data-ocid="suppliers.supplier.error_state"
              >
                {formError}
              </p>
            )}

            <div className="space-y-1">
              <Label className="text-black font-semibold text-sm">
                Supplier Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Ibn Sina"
                className="border-gray-300 text-black"
                data-ocid="suppliers.supplier.name_input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Contact Number
                </Label>
                <Input
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                  placeholder="01001234567"
                  className="border-gray-300 text-black"
                  data-ocid="suppliers.supplier.contact_input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Email
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="supplier@pharma.com"
                  className="border-gray-300 text-black"
                  data-ocid="suppliers.supplier.email_input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-black font-semibold text-sm">
                Supplied Medicines (comma-separated)
              </Label>
              <Input
                value={form.suppliedMedicinesText}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    suppliedMedicinesText: e.target.value,
                  }))
                }
                placeholder="Augmentin 1g, Amoxicillin 250mg"
                className="border-gray-300 text-black"
                data-ocid="suppliers.supplier.medicines_input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-300 text-black"
              data-ocid="suppliers.supplier.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-900 font-bold"
              data-ocid="suppliers.supplier.save_button"
            >
              {editId ? "Update Supplier" : "Add Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-white border-gray-200 max-w-sm"
          data-ocid="suppliers.supplier.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              Delete Supplier?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 font-semibold">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-gray-300 text-black"
              data-ocid="suppliers.supplier.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
              data-ocid="suppliers.supplier.delete_confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
