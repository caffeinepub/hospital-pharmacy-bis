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
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { type Sale, usePharmacy } from "../contexts/PharmacyStore";

const today = new Date().toISOString().split("T")[0];
const EMPTY_FORM = { medicineName: "", quantity: "", price: "", date: today };

export function Sales() {
  const { medicines, sales, addSale, updateSale, deleteSale } = usePharmacy();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = sales
    .filter(
      (s) =>
        s.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()),
    )
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  // Derived from selected medicine
  const selectedMedicine = useMemo(
    () => medicines.find((m) => m.name === form.medicineName) ?? null,
    [medicines, form.medicineName],
  );

  const qty = Number(form.quantity);
  const prc = Number(form.price);
  const total =
    !Number.isNaN(qty) && !Number.isNaN(prc) && qty > 0 && prc > 0
      ? qty * prc
      : 0;

  const stockExceeded =
    selectedMedicine !== null &&
    !Number.isNaN(qty) &&
    qty > 0 &&
    qty > selectedMedicine.quantity;

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().split("T")[0] });
    setFormError("");
    setDialogOpen(true);
  }

  function openEdit(s: Sale) {
    setEditId(s.id);
    setForm({
      medicineName: s.medicineName,
      quantity: String(s.quantity),
      price: String(s.price),
      date: s.date,
    });
    setFormError("");
    setDialogOpen(true);
  }

  function handleMedicineChange(name: string) {
    const med = medicines.find((m) => m.name === name);
    setForm((f) => ({
      ...f,
      medicineName: name,
      price: med ? String(med.price) : "",
    }));
    setFormError("");
  }

  function handleSave() {
    const { medicineName, date } = form;
    if (!medicineName) {
      setFormError("Please select a medicine.");
      return;
    }
    if (!qty || Number.isNaN(qty) || qty <= 0) {
      setFormError("Quantity must be a positive number.");
      return;
    }
    if (!prc || Number.isNaN(prc) || prc <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }
    if (!date) {
      setFormError("Please select a date.");
      return;
    }
    if (stockExceeded && !editId) {
      setFormError(
        `Quantity exceeds available stock (${selectedMedicine?.quantity ?? 0} units).`,
      );
      return;
    }

    if (editId) {
      updateSale(editId, {
        medicineName,
        quantity: qty,
        price: prc,
        total: qty * prc,
        date,
      });
      toast.success("Invoice updated successfully");
    } else {
      addSale({
        medicineName,
        quantity: qty,
        price: prc,
        total: qty * prc,
        date,
      });
      toast.success("Invoice created successfully");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteSale(id);
    setDeleteConfirmId(null);
    toast.success("Invoice deleted successfully");
  }

  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 md:ml-0 ml-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black font-display">
            Sales / Invoices
          </h1>
          <p className="text-sm text-gray-500 font-semibold">
            {sales.length} invoices · Total: {totalRevenue.toLocaleString()} EGP
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            className="bg-black text-white hover:bg-gray-900 font-bold"
            data-ocid="sales.add_invoice.button"
          >
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </Button>
        )}
      </div>

      <Input
        placeholder="Search by medicine or invoice ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm border-gray-300 text-black font-semibold"
        data-ocid="sales.search_input"
      />

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  ID
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Medicine
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Qty
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Price
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Total (EGP)
                </TableHead>
                <TableHead className="font-bold text-black text-xs uppercase tracking-wide">
                  Date
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
                  data-ocid={`sales.invoice.row.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs text-gray-500">
                    {s.id}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.medicineName}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.quantity}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.price}
                  </TableCell>
                  <TableCell className="font-bold text-black">
                    {s.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {s.date}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                          data-ocid={`sales.invoice.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          data-ocid={`sales.invoice.delete_button.${i + 1}`}
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
                    data-ocid="sales.empty_state"
                  >
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Invoice Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-white border-gray-200 max-w-lg"
          data-ocid="sales.invoice.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              {editId ? "Edit Invoice" : "New Invoice"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {formError && (
              <p
                className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                data-ocid="sales.invoice.error_state"
              >
                {formError}
              </p>
            )}

            <div className="space-y-1">
              <Label className="text-black font-semibold text-sm">
                Medicine
              </Label>
              <Select
                value={form.medicineName}
                onValueChange={handleMedicineChange}
              >
                <SelectTrigger
                  className="border-gray-300 text-black"
                  data-ocid="sales.invoice.medicine_select"
                >
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent>
                  {medicines
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((m) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name} (Stock: {m.quantity})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMedicine && (
              <div
                className={`text-xs font-bold px-3 py-2 rounded-lg border ${
                  selectedMedicine.quantity <= 20
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                Available Stock: {selectedMedicine.quantity} units
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-black font-semibold text-sm">
                  Quantity
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, quantity: e.target.value }));
                    setFormError("");
                  }}
                  className={`border-gray-300 text-black ${stockExceeded ? "border-red-400" : ""}`}
                  data-ocid="sales.invoice.quantity_input"
                />
                {stockExceeded && (
                  <p className="text-xs font-bold text-red-600">
                    Exceeds available stock ({selectedMedicine?.quantity})
                  </p>
                )}
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
                  data-ocid="sales.invoice.price_input"
                />
              </div>
            </div>

            {total > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Auto-calculated Total
                </p>
                <p className="text-2xl font-bold text-black mt-1">
                  {total.toLocaleString()} EGP
                </p>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-black font-semibold text-sm">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="border-gray-300 text-black"
                data-ocid="sales.invoice.date_input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-300 text-black"
              data-ocid="sales.invoice.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={stockExceeded && !editId}
              className="bg-black text-white hover:bg-gray-900 font-bold disabled:opacity-50"
              data-ocid="sales.invoice.save_button"
            >
              {editId ? "Update Invoice" : "Create Invoice"}
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
          data-ocid="sales.invoice.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-bold">
              Delete Invoice?
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
              data-ocid="sales.invoice.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
              data-ocid="sales.invoice.delete_confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
