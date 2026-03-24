import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  supplier: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  suppliedMedicines: string[];
}

export interface Sale {
  id: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_MEDICINES: Medicine[] = [
  {
    id: "m1",
    name: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 90,
    price: 45,
    expiryDate: "2026-06-15",
    supplier: "Ibn Sina",
  },
  {
    id: "m2",
    name: "ConCor 5mg",
    category: "Cardiovascular",
    quantity: 15,
    price: 32,
    expiryDate: "2026-04-20",
    supplier: "Pharma Overseas",
  },
  {
    id: "m3",
    name: "ConCor 2.5mg",
    category: "Cardiovascular",
    quantity: 80,
    price: 28,
    expiryDate: "2026-12-01",
    supplier: "Pharma Overseas",
  },
  {
    id: "m4",
    name: "ErastaPex 20mg",
    category: "Antihypertensive",
    quantity: 60,
    price: 55,
    expiryDate: "2026-09-30",
    supplier: "United Pharma",
  },
  {
    id: "m5",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    quantity: 200,
    price: 5,
    expiryDate: "2027-01-01",
    supplier: "Al-Ezaby",
  },
  {
    id: "m6",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    quantity: 120,
    price: 18,
    expiryDate: "2026-11-15",
    supplier: "Ibn Sina",
  },
  {
    id: "m7",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    quantity: 150,
    price: 12,
    expiryDate: "2027-03-01",
    supplier: "United Pharma",
  },
  {
    id: "m8",
    name: "Atorvastatin 10mg",
    category: "Cardiovascular",
    quantity: 95,
    price: 35,
    expiryDate: "2026-10-20",
    supplier: "Pharma Overseas",
  },
  {
    id: "m9",
    name: "Omeprazole 20mg",
    category: "Gastrointestinal",
    quantity: 8,
    price: 22,
    expiryDate: "2026-03-30",
    supplier: "Al-Ezaby",
  },
  {
    id: "m10",
    name: "Aspirin 100mg",
    category: "Analgesic",
    quantity: 180,
    price: 8,
    expiryDate: "2027-06-01",
    supplier: "Ibn Sina",
  },
  {
    id: "m11",
    name: "Glucophage 500mg",
    category: "Antidiabetic",
    quantity: 250,
    price: 14,
    expiryDate: "2027-08-20",
    supplier: "United Pharma",
  },
  {
    id: "m12",
    name: "Nexium 40mg",
    category: "Gastrointestinal",
    quantity: 140,
    price: 38,
    expiryDate: "2027-07-22",
    supplier: "Pharma Overseas",
  },
  {
    id: "m13",
    name: "Flagyl 500mg",
    category: "Antibiotics",
    quantity: 130,
    price: 20,
    expiryDate: "2026-10-31",
    supplier: "Al-Ezaby",
  },
  {
    id: "m14",
    name: "Pantoprazole 40mg",
    category: "Gastrointestinal",
    quantity: 18,
    price: 25,
    expiryDate: "2026-05-10",
    supplier: "Ibn Sina",
  },
  {
    id: "m15",
    name: "Lisinopril 10mg",
    category: "Antihypertensive",
    quantity: 110,
    price: 30,
    expiryDate: "2026-12-15",
    supplier: "United Pharma",
  },
];

const SEED_SUPPLIERS: Supplier[] = [
  {
    id: "s1",
    name: "Ibn Sina",
    contact: "01001234567",
    email: "ibnsina@pharma.com",
    suppliedMedicines: [
      "Augmentin 1g",
      "Amoxicillin 250mg",
      "Aspirin 100mg",
      "Pantoprazole 40mg",
    ],
  },
  {
    id: "s2",
    name: "Pharma Overseas",
    contact: "01112345678",
    email: "overseas@pharma.com",
    suppliedMedicines: [
      "ConCor 5mg",
      "ConCor 2.5mg",
      "Atorvastatin 10mg",
      "Nexium 40mg",
    ],
  },
  {
    id: "s3",
    name: "United Pharma",
    contact: "01223456789",
    email: "united@pharma.com",
    suppliedMedicines: [
      "ErastaPex 20mg",
      "Metformin 500mg",
      "Glucophage 500mg",
      "Lisinopril 10mg",
    ],
  },
  {
    id: "s4",
    name: "Al-Ezaby",
    contact: "01334567890",
    email: "alezaby@pharma.com",
    suppliedMedicines: ["Paracetamol 500mg", "Omeprazole 20mg", "Flagyl 500mg"],
  },
];

const SEED_SALES: Sale[] = [
  {
    id: "sl1",
    medicineName: "Augmentin 1g",
    quantity: 3,
    price: 45,
    total: 135,
    date: "2026-01-05",
  },
  {
    id: "sl2",
    medicineName: "Paracetamol 500mg",
    quantity: 10,
    price: 5,
    total: 50,
    date: "2026-01-07",
  },
  {
    id: "sl3",
    medicineName: "ConCor 5mg",
    quantity: 2,
    price: 32,
    total: 64,
    date: "2026-01-10",
  },
  {
    id: "sl4",
    medicineName: "Metformin 500mg",
    quantity: 5,
    price: 12,
    total: 60,
    date: "2026-01-12",
  },
  {
    id: "sl5",
    medicineName: "Aspirin 100mg",
    quantity: 8,
    price: 8,
    total: 64,
    date: "2026-01-15",
  },
  {
    id: "sl6",
    medicineName: "Amoxicillin 250mg",
    quantity: 4,
    price: 18,
    total: 72,
    date: "2026-01-18",
  },
  {
    id: "sl7",
    medicineName: "Omeprazole 20mg",
    quantity: 3,
    price: 22,
    total: 66,
    date: "2026-01-20",
  },
  {
    id: "sl8",
    medicineName: "ErastaPex 20mg",
    quantity: 2,
    price: 55,
    total: 110,
    date: "2026-01-22",
  },
  {
    id: "sl9",
    medicineName: "Glucophage 500mg",
    quantity: 6,
    price: 14,
    total: 84,
    date: "2026-01-25",
  },
  {
    id: "sl10",
    medicineName: "Nexium 40mg",
    quantity: 3,
    price: 38,
    total: 114,
    date: "2026-01-28",
  },
  {
    id: "sl11",
    medicineName: "Augmentin 1g",
    quantity: 5,
    price: 45,
    total: 225,
    date: "2026-02-02",
  },
  {
    id: "sl12",
    medicineName: "Atorvastatin 10mg",
    quantity: 4,
    price: 35,
    total: 140,
    date: "2026-02-05",
  },
  {
    id: "sl13",
    medicineName: "Paracetamol 500mg",
    quantity: 15,
    price: 5,
    total: 75,
    date: "2026-02-07",
  },
  {
    id: "sl14",
    medicineName: "ConCor 2.5mg",
    quantity: 3,
    price: 28,
    total: 84,
    date: "2026-02-10",
  },
  {
    id: "sl15",
    medicineName: "Flagyl 500mg",
    quantity: 4,
    price: 20,
    total: 80,
    date: "2026-02-12",
  },
  {
    id: "sl16",
    medicineName: "Aspirin 100mg",
    quantity: 10,
    price: 8,
    total: 80,
    date: "2026-02-14",
  },
  {
    id: "sl17",
    medicineName: "Metformin 500mg",
    quantity: 7,
    price: 12,
    total: 84,
    date: "2026-02-16",
  },
  {
    id: "sl18",
    medicineName: "Lisinopril 10mg",
    quantity: 5,
    price: 30,
    total: 150,
    date: "2026-02-18",
  },
  {
    id: "sl19",
    medicineName: "Amoxicillin 250mg",
    quantity: 6,
    price: 18,
    total: 108,
    date: "2026-02-20",
  },
  {
    id: "sl20",
    medicineName: "Nexium 40mg",
    quantity: 4,
    price: 38,
    total: 152,
    date: "2026-02-22",
  },
  {
    id: "sl21",
    medicineName: "Augmentin 1g",
    quantity: 4,
    price: 45,
    total: 180,
    date: "2026-02-25",
  },
  {
    id: "sl22",
    medicineName: "Glucophage 500mg",
    quantity: 8,
    price: 14,
    total: 112,
    date: "2026-02-27",
  },
  {
    id: "sl23",
    medicineName: "ErastaPex 20mg",
    quantity: 3,
    price: 55,
    total: 165,
    date: "2026-03-01",
  },
  {
    id: "sl24",
    medicineName: "Paracetamol 500mg",
    quantity: 20,
    price: 5,
    total: 100,
    date: "2026-03-03",
  },
  {
    id: "sl25",
    medicineName: "ConCor 5mg",
    quantity: 2,
    price: 32,
    total: 64,
    date: "2026-03-05",
  },
  {
    id: "sl26",
    medicineName: "Atorvastatin 10mg",
    quantity: 5,
    price: 35,
    total: 175,
    date: "2026-03-07",
  },
  {
    id: "sl27",
    medicineName: "Omeprazole 20mg",
    quantity: 2,
    price: 22,
    total: 44,
    date: "2026-03-09",
  },
  {
    id: "sl28",
    medicineName: "Flagyl 500mg",
    quantity: 6,
    price: 20,
    total: 120,
    date: "2026-03-11",
  },
  {
    id: "sl29",
    medicineName: "Aspirin 100mg",
    quantity: 12,
    price: 8,
    total: 96,
    date: "2026-03-13",
  },
  {
    id: "sl30",
    medicineName: "Metformin 500mg",
    quantity: 8,
    price: 12,
    total: 96,
    date: "2026-03-15",
  },
  {
    id: "sl31",
    medicineName: "Amoxicillin 250mg",
    quantity: 5,
    price: 18,
    total: 90,
    date: "2026-03-17",
  },
  {
    id: "sl32",
    medicineName: "Nexium 40mg",
    quantity: 3,
    price: 38,
    total: 114,
    date: "2026-03-19",
  },
  {
    id: "sl33",
    medicineName: "ConCor 2.5mg",
    quantity: 4,
    price: 28,
    total: 112,
    date: "2026-03-21",
  },
  {
    id: "sl34",
    medicineName: "Augmentin 1g",
    quantity: 6,
    price: 45,
    total: 270,
    date: "2026-03-23",
  },
  {
    id: "sl35",
    medicineName: "Glucophage 500mg",
    quantity: 10,
    price: 14,
    total: 140,
    date: "2026-03-25",
  },
  {
    id: "sl36",
    medicineName: "Lisinopril 10mg",
    quantity: 4,
    price: 30,
    total: 120,
    date: "2026-03-27",
  },
  {
    id: "sl37",
    medicineName: "Pantoprazole 40mg",
    quantity: 3,
    price: 25,
    total: 75,
    date: "2026-03-29",
  },
  {
    id: "sl38",
    medicineName: "ErastaPex 20mg",
    quantity: 2,
    price: 55,
    total: 110,
    date: "2026-03-30",
  },
  {
    id: "sl39",
    medicineName: "Paracetamol 500mg",
    quantity: 18,
    price: 5,
    total: 90,
    date: "2026-03-31",
  },
  {
    id: "sl40",
    medicineName: "Atorvastatin 10mg",
    quantity: 3,
    price: 35,
    total: 105,
    date: "2026-03-31",
  },
];

// ── Context Type ─────────────────────────────────────────────────────────────
interface PharmacyContextValue {
  medicines: Medicine[];
  suppliers: Supplier[];
  sales: Sale[];
  // Derived
  totalRevenue: number;
  totalSales: number;
  totalMedicines: number;
  totalSuppliers: number;
  lowStockMedicines: Medicine[];
  nearExpiryMedicines: Medicine[];
  topSellingMedicines: { name: string; qty: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  monthlySales: { month: string; count: number }[];
  // CRUD
  addMedicine: (m: Omit<Medicine, "id">) => string | null;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addSupplier: (s: Omit<Supplier, "id">) => string | null;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addSale: (sale: Omit<Sale, "id">) => string | null;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
}

const PharmacyContext = createContext<PharmacyContextValue | null>(null);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function PharmacyStoreProvider({
  children,
}: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(SEED_MEDICINES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SEED_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>(SEED_SALES);

  // ── CRUD: Medicines ──
  const addMedicine = useCallback(
    (m: Omit<Medicine, "id">): string | null => {
      const dup = medicines.find(
        (x) => x.name.trim().toLowerCase() === m.name.trim().toLowerCase(),
      );
      if (dup) return "This medicine already exists.";
      const id = `m${Date.now()}`;
      setMedicines((prev) => [...prev, { ...m, id }]);
      return null;
    },
    [medicines],
  );

  const updateMedicine = useCallback(
    (id: string, updates: Partial<Medicine>) => {
      setMedicines((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      );
    },
    [],
  );

  const deleteMedicine = useCallback((id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ── CRUD: Suppliers ──
  const addSupplier = useCallback(
    (s: Omit<Supplier, "id">): string | null => {
      const dup = suppliers.find(
        (x) => x.name.trim().toLowerCase() === s.name.trim().toLowerCase(),
      );
      if (dup) return "This supplier already exists.";
      const id = `s${Date.now()}`;
      setSuppliers((prev) => [...prev, { ...s, id }]);
      return null;
    },
    [suppliers],
  );

  const updateSupplier = useCallback(
    (id: string, updates: Partial<Supplier>) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── CRUD: Sales ──
  const addSale = useCallback((sale: Omit<Sale, "id">): string | null => {
    const id = `sl${Date.now()}`;
    setSales((prev) => [...prev, { ...sale, id }]);
    // Reduce stock
    setMedicines((prev) =>
      prev.map((m) =>
        m.name === sale.medicineName
          ? { ...m, quantity: Math.max(0, m.quantity - sale.quantity) }
          : m,
      ),
    );
    return null;
  }, []);

  const updateSale = useCallback((id: string, updates: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  }, []);

  const deleteSale = useCallback((id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Derived values ──
  const totalRevenue = useMemo(
    () => sales.reduce((sum, s) => sum + s.total, 0),
    [sales],
  );
  const totalSales = useMemo(() => sales.length, [sales]);
  const totalMedicines = useMemo(() => medicines.length, [medicines]);
  const totalSuppliers = useMemo(() => suppliers.length, [suppliers]);

  const lowStockMedicines = useMemo(
    () => medicines.filter((m) => m.quantity <= 20),
    [medicines],
  );

  const nearExpiryMedicines = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + 90);
    return medicines.filter((m) => new Date(m.expiryDate) <= threshold);
  }, [medicines]);

  const topSellingMedicines = useMemo(() => {
    const agg: Record<string, number> = {};
    for (const s of sales) {
      agg[s.medicineName] = (agg[s.medicineName] || 0) + s.quantity;
    }
    return Object.entries(agg)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
  }, [sales]);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const result: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const revenue = sales
        .filter((s) => s.date.startsWith(key))
        .reduce((sum, s) => sum + s.total, 0);
      result.push({ month: MONTHS[d.getMonth()], revenue });
    }
    return result;
  }, [sales]);

  const monthlySales = useMemo(() => {
    const now = new Date();
    const result: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = sales.filter((s) => s.date.startsWith(key)).length;
      result.push({ month: MONTHS[d.getMonth()], count });
    }
    return result;
  }, [sales]);

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        suppliers,
        sales,
        totalRevenue,
        totalSales,
        totalMedicines,
        totalSuppliers,
        lowStockMedicines,
        nearExpiryMedicines,
        topSellingMedicines,
        monthlyRevenue,
        monthlySales,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addSale,
        updateSale,
        deleteSale,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy(): PharmacyContextValue {
  const ctx = useContext(PharmacyContext);
  if (!ctx)
    throw new Error("usePharmacy must be used within PharmacyStoreProvider");
  return ctx;
}
