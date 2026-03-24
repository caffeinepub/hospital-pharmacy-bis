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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { type Medicine, usePharmacy } from "../contexts/PharmacyStore";

const CATEGORIES = [
  "Antibiotics",
  "Cardiovascular",
  "Analgesic",
  "Antihypertensive",
  "Antidiabetic",
  "Gastrointestinal",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  category: "",
  quantity: "",
  price: "",
  expiryDate: "",
  supplier: "",
};

function isNearExpiry(dateStr: string): boolean {
  const expiry = new Date(dateStr);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + 90);
  return expiry <= threshold;
}

export function Inventory() {
  const { medicines, suppliers, addMedicine, updateMedicine, deleteMedicine } =
    usePharmacy();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  }

  function openEdit(m: Medicine) {
    setEditId(m.id);
    setForm({
      name: m.name,
      category: m.category,
      quantity: String(m.quantity),
      price: String(m.price),
      expiryDate: m.expiryDate,
      supplier: m.supplier,
    });
    setFormError("");
    setDialogOpen(true);
  }

  function handleSave() {
    const { name, category, quantity, price, expiryDate, supplier } = form;
    if (
      !name.trim() ||
      !category ||
      !quantity ||
      !price ||
      !expiryDate ||
      !supplier
    ) {
      setFormError("All fields are required.");
      return;
    }
    const qty = Number(quantity);
    const prc = Number(price);
    if (Number.isNaN(qty) || qty < 0) {
      setFormError("Quantity must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(prc) || prc <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    if (editId) {
      updateMedicine(editId, {
        name: name.trim(),
        category,
        quantity: qty,
        price: prc,
        expiryDate,
        supplier,
      });
      toast.success("Medicine updated successfully");
    } else {
      const error = addMedicine({
        name: name.trim(),
        category,
        quantity: qty,
        price: prc,
        expiryDate,
        supplier,
      });
      if (error) {
        setFormError(error);
        return;
      }
      toast.success("Medicine added successfully");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteMedicine(id);
    setDeleteConfirmId(null);
    toast.success("Medicine deleted successfully");
  }

  return (
    <div className="p-4 md:p-6 space-y-5 md:ml-0 ml-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black font-display">
            Medicines
          </h1>
          <p className="text-sm text-gray-500 font-semibold">
            {medicines.length} total medicines
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            className="bg-black text-white hover:bg-gray-900 font-bold"
            data-ocid="inventory.add_medicine.button"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Medicine
          </Button>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Search medicines…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm border-gray-300 text-black font-semibold"
        data-ocid="inventory.search_input"
      />

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Name
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Category
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Qty
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Price (EGP)
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Expiry Date
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Supplier
                </TableHead>
                {isAdmin && (
                  <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m, i) => (
                <TableRow
                  key={m.id}
                  className="border-b border-gray-100"
                  data-ocid={`inventory.medicine.row.${i + 1}`}
                >
                  <TableCell className="font-semibold text-black">
                    {m.name}
                    {isNearExpiry(m.expiryDate) && (
                      <Badge className="ml-2 bg-red-100 text-red-800 text-[10px] font-bold border-0">
                        Near Expiry
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-black font-semibold">
                    {m.category}
                  </TableCell>
                  <TableCell className="font-bold">
                    <span
                      className={
                        m.quantity <= 20 ? "text-red-600" : "text-black"
                      }
                    >
                      {m.quantity}
                    </span>
                    {m.quantity <= 20 && (
                      <Badge className="ml-2 bg-red-100 text-red-800 text-[10px] font-bold border-0">
                        Low Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {m.price}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {m.expiryDate}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {m.supplier}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                          data-ocid={`inventory.medicine.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(m.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          data-ocid={`inventory.medicine.delete_button.${i + 1}`}
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
                    colSpan={isAdmin ? 7 : 6}
                    className="text-center py-8 text-gray-400 font-semibold"
                    data-ocid="inventory.empty_state"
                  >
                    No medicines found.
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
          data-ocid="inventory.medicine.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              {editId ? "Edit Medicine" : "Add Medicine"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {formError && (
              <p
                className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                data-ocid="inventory.medicine.error_state"
              >
                {formError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Medicine Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Augmentin 1g"
                  className="border-gray-300 text-black"
                  data-ocid="inventory.medicine.name_input"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    className="border-gray-300 text-black"
                    data-ocid="inventory.medicine.category_select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Supplier
                </Label>
                <Select
                  value={form.supplier}
                  onValueChange={(v) => setForm((f) => ({ ...f, supplier: v }))}
                >
                  <SelectTrigger
                    className="border-gray-300 text-black"
                    data-ocid="inventory.medicine.supplier_select"
                  >
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Quantity
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  className="border-gray-300 text-black"
                  data-ocid="inventory.medicine.quantity_input"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Price (EGP)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="border-gray-300 text-black"
                  data-ocid="inventory.medicine.price_input"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Expiry Date
                </Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="border-gray-300 text-black"
                  data-ocid="inventory.medicine.expiry_input"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-300 text-black"
              data-ocid="inventory.medicine.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-900 font-bold"
              data-ocid="inventory.medicine.save_button"
            >
              {editId ? "Update Medicine" : "Add Medicine"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-white border-gray-200 max-w-sm"
          data-ocid="inventory.medicine.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              Delete Medicine?
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
              data-ocid="inventory.medicine.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
              data-ocid="inventory.medicine.delete_confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
