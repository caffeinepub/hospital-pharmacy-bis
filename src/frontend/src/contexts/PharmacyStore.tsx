import { useActor } from "@/hooks/useActor";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface StoreMedicine {
  id: bigint;
  name: string;
  category: string;
  dosage: string;
  quantity: bigint;
  supplierId: bigint;
  purchasePrice: number;
  salePrice: number;
  expiryDate: string;
  isNearExpiry: boolean;
}

export interface StoreSupplier {
  id: bigint;
  name: string;
  contact: string;
}

export interface StoreSale {
  id: bigint;
  medicineId: bigint;
  medicineName: string;
  category: string;
  quantity: bigint;
  salePrice: number;
  totalPrice: number;
  patientName: string;
  saleDate: string;
  purchasePrice: number;
}

// ── Static seed data ──────────────────────────────────────────────────────────
const SEED_MEDICINES: StoreMedicine[] = [
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

const SEED_SUPPLIERS: StoreSupplier[] = [
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

const SEED_SALES: StoreSale[] = [
  {
    id: 1n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 15.5,
    totalPrice: 31.0,
    patientName: "Ahmed Hassan",
    saleDate: "2026-01-03",
    purchasePrice: 10.85,
  },
  {
    id: 2n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 3n,
    salePrice: 5.5,
    totalPrice: 16.5,
    patientName: "Fatima Ali",
    saleDate: "2026-01-05",
    purchasePrice: 3.85,
  },
  {
    id: 3n,
    medicineId: 1n,
    medicineName: "ConCor 2.5mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 4.5,
    totalPrice: 4.5,
    patientName: "Mohamed Samir",
    saleDate: "2026-01-06",
    purchasePrice: 3.15,
  },
  {
    id: 4n,
    medicineId: 8n,
    medicineName: "Tavanic 500mg",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 18.0,
    totalPrice: 36.0,
    patientName: "Sara Khalil",
    saleDate: "2026-01-08",
    purchasePrice: 12.6,
  },
  {
    id: 5n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 9.5,
    totalPrice: 19.0,
    patientName: "Omar Farouk",
    saleDate: "2026-01-10",
    purchasePrice: 6.65,
  },
  {
    id: 6n,
    medicineId: 16n,
    medicineName: "Controloc 40mg",
    category: "Ulcer & Others",
    quantity: 1n,
    salePrice: 9.25,
    totalPrice: 9.25,
    patientName: "Layla Nasser",
    saleDate: "2026-01-12",
    purchasePrice: 6.48,
  },
  {
    id: 7n,
    medicineId: 14n,
    medicineName: "Glucophage 1000mg",
    category: "Diabetes",
    quantity: 3n,
    salePrice: 8.0,
    totalPrice: 24.0,
    patientName: "Karim Adel",
    saleDate: "2026-01-14",
    purchasePrice: 5.6,
  },
  {
    id: 8n,
    medicineId: 7n,
    medicineName: "SupraX 400mg",
    category: "Antibiotics",
    quantity: 1n,
    salePrice: 12.0,
    totalPrice: 12.0,
    patientName: "Nour Ibrahim",
    saleDate: "2026-01-15",
    purchasePrice: 8.4,
  },
  {
    id: 9n,
    medicineId: 3n,
    medicineName: "ConCor 10mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 7.2,
    totalPrice: 14.4,
    patientName: "Hana Mostafa",
    saleDate: "2026-01-17",
    purchasePrice: 5.04,
  },
  {
    id: 10n,
    medicineId: 17n,
    medicineName: "Nexium 40mg",
    category: "Ulcer & Others",
    quantity: 2n,
    salePrice: 11.5,
    totalPrice: 23.0,
    patientName: "Tarek Saleh",
    saleDate: "2026-01-19",
    purchasePrice: 8.05,
  },
  {
    id: 11n,
    medicineId: 12n,
    medicineName: "Amaryl 2mg",
    category: "Diabetes",
    quantity: 1n,
    salePrice: 12.0,
    totalPrice: 12.0,
    patientName: "Rana Mahmoud",
    saleDate: "2026-01-21",
    purchasePrice: 8.4,
  },
  {
    id: 12n,
    medicineId: 5n,
    medicineName: "ErastaPex 40mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 11.0,
    totalPrice: 22.0,
    patientName: "Youssef Amr",
    saleDate: "2026-01-22",
    purchasePrice: 7.7,
  },
  {
    id: 13n,
    medicineId: 20n,
    medicineName: "Crestor 10mg",
    category: "Ulcer & Others",
    quantity: 1n,
    salePrice: 14.0,
    totalPrice: 14.0,
    patientName: "Dina Sami",
    saleDate: "2026-01-24",
    purchasePrice: 9.8,
  },
  {
    id: 14n,
    medicineId: 9n,
    medicineName: "Ceftriaxone 1g",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 22.5,
    totalPrice: 45.0,
    patientName: "Walid Fathy",
    saleDate: "2026-01-25",
    purchasePrice: 15.75,
  },
  {
    id: 15n,
    medicineId: 15n,
    medicineName: "Galvus Met 50/1000mg",
    category: "Diabetes",
    quantity: 1n,
    salePrice: 24.0,
    totalPrice: 24.0,
    patientName: "Mona Zaki",
    saleDate: "2026-01-27",
    purchasePrice: 16.8,
  },
  {
    id: 16n,
    medicineId: 18n,
    medicineName: "Pantoloc 20mg",
    category: "Ulcer & Others",
    quantity: 2n,
    salePrice: 7.8,
    totalPrice: 15.6,
    patientName: "Khaled Gamal",
    saleDate: "2026-01-29",
    purchasePrice: 5.46,
  },
  {
    id: 17n,
    medicineId: 2n,
    medicineName: "ConCor 5mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 5.75,
    totalPrice: 5.75,
    patientName: "Amira Hossam",
    saleDate: "2026-01-31",
    purchasePrice: 4.03,
  },
  {
    id: 18n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 3n,
    salePrice: 15.5,
    totalPrice: 46.5,
    patientName: "Hassan Youssef",
    saleDate: "2026-02-02",
    purchasePrice: 10.85,
  },
  {
    id: 19n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 5.5,
    totalPrice: 11.0,
    patientName: "Nadia Hamid",
    saleDate: "2026-02-03",
    purchasePrice: 3.85,
  },
  {
    id: 20n,
    medicineId: 10n,
    medicineName: "Flagyl 500mg",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 6.75,
    totalPrice: 13.5,
    patientName: "Sherif Taha",
    saleDate: "2026-02-05",
    purchasePrice: 4.73,
  },
  {
    id: 21n,
    medicineId: 4n,
    medicineName: "ErastaPex 20mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 8.5,
    totalPrice: 8.5,
    patientName: "Ghada Shawky",
    saleDate: "2026-02-07",
    purchasePrice: 5.95,
  },
  {
    id: 22n,
    medicineId: 14n,
    medicineName: "Glucophage 1000mg",
    category: "Diabetes",
    quantity: 4n,
    salePrice: 8.0,
    totalPrice: 32.0,
    patientName: "Bassem Ragab",
    saleDate: "2026-02-08",
    purchasePrice: 5.6,
  },
  {
    id: 23n,
    medicineId: 7n,
    medicineName: "SupraX 400mg",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 12.0,
    totalPrice: 24.0,
    patientName: "Marwa Salem",
    saleDate: "2026-02-10",
    purchasePrice: 8.4,
  },
  {
    id: 24n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 1n,
    salePrice: 9.5,
    totalPrice: 9.5,
    patientName: "Islam Gohar",
    saleDate: "2026-02-12",
    purchasePrice: 6.65,
  },
  {
    id: 25n,
    medicineId: 16n,
    medicineName: "Controloc 40mg",
    category: "Ulcer & Others",
    quantity: 3n,
    salePrice: 9.25,
    totalPrice: 27.75,
    patientName: "Doaa Farid",
    saleDate: "2026-02-13",
    purchasePrice: 6.48,
  },
  {
    id: 26n,
    medicineId: 1n,
    medicineName: "ConCor 2.5mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 4.5,
    totalPrice: 9.0,
    patientName: "Ramy Khalil",
    saleDate: "2026-02-15",
    purchasePrice: 3.15,
  },
  {
    id: 27n,
    medicineId: 22n,
    medicineName: "Bisoprolol 5mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 6.0,
    totalPrice: 6.0,
    patientName: "Heba Nabil",
    saleDate: "2026-02-17",
    purchasePrice: 4.2,
  },
  {
    id: 28n,
    medicineId: 24n,
    medicineName: "Omeprazole 20mg",
    category: "Ulcer & Others",
    quantity: 2n,
    salePrice: 3.8,
    totalPrice: 7.6,
    patientName: "Tamer Bahgat",
    saleDate: "2026-02-18",
    purchasePrice: 2.66,
  },
  {
    id: 29n,
    medicineId: 19n,
    medicineName: "Ator 20mg",
    category: "Ulcer & Others",
    quantity: 1n,
    salePrice: 8.5,
    totalPrice: 8.5,
    patientName: "Noha Wahid",
    saleDate: "2026-02-20",
    purchasePrice: 5.95,
  },
  {
    id: 30n,
    medicineId: 23n,
    medicineName: "Metformin 850mg",
    category: "Diabetes",
    quantity: 3n,
    salePrice: 4.75,
    totalPrice: 14.25,
    patientName: "Mahmoud Saeed",
    saleDate: "2026-02-22",
    purchasePrice: 3.33,
  },
  {
    id: 31n,
    medicineId: 9n,
    medicineName: "Ceftriaxone 1g",
    category: "Antibiotics",
    quantity: 1n,
    salePrice: 22.5,
    totalPrice: 22.5,
    patientName: "Salma Adel",
    saleDate: "2026-02-24",
    purchasePrice: 15.75,
  },
  {
    id: 32n,
    medicineId: 3n,
    medicineName: "ConCor 10mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 7.2,
    totalPrice: 14.4,
    patientName: "Kamal Ibrahim",
    saleDate: "2026-02-26",
    purchasePrice: 5.04,
  },
  {
    id: 33n,
    medicineId: 17n,
    medicineName: "Nexium 40mg",
    category: "Ulcer & Others",
    quantity: 1n,
    salePrice: 11.5,
    totalPrice: 11.5,
    patientName: "Yasmine Fawzy",
    saleDate: "2026-02-28",
    purchasePrice: 8.05,
  },
  {
    id: 34n,
    medicineId: 20n,
    medicineName: "Crestor 10mg",
    category: "Ulcer & Others",
    quantity: 2n,
    salePrice: 14.0,
    totalPrice: 28.0,
    patientName: "Adel Mansour",
    saleDate: "2026-03-01",
    purchasePrice: 9.8,
  },
  {
    id: 35n,
    medicineId: 5n,
    medicineName: "ErastaPex 40mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 11.0,
    totalPrice: 11.0,
    patientName: "Rania Khalaf",
    saleDate: "2026-03-03",
    purchasePrice: 7.7,
  },
  {
    id: 36n,
    medicineId: 12n,
    medicineName: "Amaryl 2mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 12.0,
    totalPrice: 24.0,
    patientName: "Sameh Naggar",
    saleDate: "2026-03-05",
    purchasePrice: 8.4,
  },
  {
    id: 37n,
    medicineId: 8n,
    medicineName: "Tavanic 500mg",
    category: "Antibiotics",
    quantity: 1n,
    salePrice: 18.0,
    totalPrice: 18.0,
    patientName: "Eman Saber",
    saleDate: "2026-03-07",
    purchasePrice: 12.6,
  },
  {
    id: 38n,
    medicineId: 15n,
    medicineName: "Galvus Met 50/1000mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 24.0,
    totalPrice: 48.0,
    patientName: "Mostafa Zidan",
    saleDate: "2026-03-08",
    purchasePrice: 16.8,
  },
  {
    id: 39n,
    medicineId: 21n,
    medicineName: "Aspirin 100mg",
    category: "Ulcer & Others",
    quantity: 4n,
    salePrice: 2.5,
    totalPrice: 10.0,
    patientName: "Lamia Hamdan",
    saleDate: "2026-03-10",
    purchasePrice: 1.75,
  },
  {
    id: 40n,
    medicineId: 10n,
    medicineName: "Flagyl 500mg",
    category: "Antibiotics",
    quantity: 3n,
    salePrice: 6.75,
    totalPrice: 20.25,
    patientName: "Ihab Wahba",
    saleDate: "2026-03-12",
    purchasePrice: 4.73,
  },
  {
    id: 41n,
    medicineId: 4n,
    medicineName: "ErastaPex 20mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 8.5,
    totalPrice: 17.0,
    patientName: "Sahar Tawfik",
    saleDate: "2026-03-14",
    purchasePrice: 5.95,
  },
  {
    id: 42n,
    medicineId: 18n,
    medicineName: "Pantoloc 20mg",
    category: "Ulcer & Others",
    quantity: 1n,
    salePrice: 7.8,
    totalPrice: 7.8,
    patientName: "Tarek Amin",
    saleDate: "2026-03-15",
    purchasePrice: 5.46,
  },
  {
    id: 43n,
    medicineId: 13n,
    medicineName: "Glucophage 500mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 5.5,
    totalPrice: 11.0,
    patientName: "Asmaa Lotfy",
    saleDate: "2026-03-17",
    purchasePrice: 3.85,
  },
  {
    id: 44n,
    medicineId: 2n,
    medicineName: "ConCor 5mg",
    category: "Hypertension",
    quantity: 1n,
    salePrice: 5.75,
    totalPrice: 5.75,
    patientName: "Sherif Barakat",
    saleDate: "2026-03-19",
    purchasePrice: 4.03,
  },
  {
    id: 45n,
    medicineId: 24n,
    medicineName: "Omeprazole 20mg",
    category: "Ulcer & Others",
    quantity: 3n,
    salePrice: 3.8,
    totalPrice: 11.4,
    patientName: "Nermeen Kamal",
    saleDate: "2026-03-20",
    purchasePrice: 2.66,
  },
  {
    id: 46n,
    medicineId: 22n,
    medicineName: "Bisoprolol 5mg",
    category: "Hypertension",
    quantity: 2n,
    salePrice: 6.0,
    totalPrice: 12.0,
    patientName: "Ahmed Gaber",
    saleDate: "2026-03-21",
    purchasePrice: 4.2,
  },
  {
    id: 47n,
    medicineId: 6n,
    medicineName: "Augmentin 1g",
    category: "Antibiotics",
    quantity: 2n,
    salePrice: 15.5,
    totalPrice: 31.0,
    patientName: "Dalia Ramadan",
    saleDate: "2026-03-23",
    purchasePrice: 10.85,
  },
  {
    id: 48n,
    medicineId: 11n,
    medicineName: "Amaryl 1mg",
    category: "Diabetes",
    quantity: 1n,
    salePrice: 9.5,
    totalPrice: 9.5,
    patientName: "Ossama Helal",
    saleDate: "2026-03-25",
    purchasePrice: 6.65,
  },
  {
    id: 49n,
    medicineId: 19n,
    medicineName: "Ator 20mg",
    category: "Ulcer & Others",
    quantity: 2n,
    salePrice: 8.5,
    totalPrice: 17.0,
    patientName: "Ghada Nour",
    saleDate: "2026-03-27",
    purchasePrice: 5.95,
  },
  {
    id: 50n,
    medicineId: 23n,
    medicineName: "Metformin 850mg",
    category: "Diabetes",
    quantity: 2n,
    salePrice: 4.75,
    totalPrice: 9.5,
    patientName: "Medhat Selim",
    saleDate: "2026-03-28",
    purchasePrice: 3.33,
  },
];

// ── Context ──────────────────────────────────────────────────────────────────
interface PharmacyStoreContextType {
  medicines: StoreMedicine[];
  suppliers: StoreSupplier[];
  sales: StoreSale[];
  totalRevenue: number;
  totalMedicines: number;
  totalSales: number;
  addMedicine: (data: Omit<StoreMedicine, "id">) => Promise<void>;
  updateMedicine: (
    id: bigint,
    data: Omit<StoreMedicine, "id">,
  ) => Promise<void>;
  deleteMedicine: (id: bigint) => Promise<void>;
  addSupplier: (data: Omit<StoreSupplier, "id">) => Promise<void>;
  updateSupplier: (
    id: bigint,
    data: Omit<StoreSupplier, "id">,
  ) => Promise<void>;
  deleteSupplier: (id: bigint) => Promise<void>;
  recordSale: (data: {
    medicineId: bigint;
    quantity: bigint;
    patientName: string;
    saleDate: string;
  }) => Promise<StoreSale | null>;
}

const PharmacyStoreContext = createContext<PharmacyStoreContextType | null>(
  null,
);

export function PharmacyStoreProvider({
  children,
}: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [medicines, setMedicines] = useState<StoreMedicine[]>(SEED_MEDICINES);
  const [suppliers, setSuppliers] = useState<StoreSupplier[]>(SEED_SUPPLIERS);
  const [sales, setSales] = useState<StoreSale[]>(SEED_SALES);
  const nextMedId = useRef(BigInt(SEED_MEDICINES.length + 1));
  const nextSupId = useRef(BigInt(SEED_SUPPLIERS.length + 1));
  const nextSaleId = useRef(BigInt(SEED_SALES.length + 1));

  const addMedicine = useCallback(
    async (data: Omit<StoreMedicine, "id">) => {
      const id = nextMedId.current++;
      setMedicines((prev) => [...prev, { ...data, id }]);
      try {
        if (actor)
          await actor.addMedicine(
            data.name,
            data.category,
            data.dosage,
            data.quantity,
            data.supplierId,
            data.purchasePrice,
            data.salePrice,
            data.expiryDate,
            data.isNearExpiry,
          );
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const updateMedicine = useCallback(
    async (id: bigint, data: Omit<StoreMedicine, "id">) => {
      setMedicines((prev) =>
        prev.map((m) => (m.id === id ? { ...data, id } : m)),
      );
      try {
        if (actor)
          await actor.updateMedicine(
            id,
            data.name,
            data.category,
            data.dosage,
            data.quantity,
            data.supplierId,
            data.purchasePrice,
            data.salePrice,
            data.expiryDate,
            data.isNearExpiry,
          );
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const deleteMedicine = useCallback(
    async (id: bigint) => {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      try {
        if (actor) await actor.deleteMedicine(id);
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const addSupplier = useCallback(
    async (data: Omit<StoreSupplier, "id">) => {
      const id = nextSupId.current++;
      setSuppliers((prev) => [...prev, { ...data, id }]);
      try {
        if (actor) await actor.addSupplier(data.name, data.contact);
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const updateSupplier = useCallback(
    async (id: bigint, data: Omit<StoreSupplier, "id">) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...data, id } : s)),
      );
      try {
        if (actor) await actor.updateSupplier(id, data.name, data.contact);
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const deleteSupplier = useCallback(
    async (id: bigint) => {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      try {
        if (actor) await actor.deleteSupplier(id);
      } catch {
        /* silent */
      }
    },
    [actor],
  );

  const recordSale = useCallback(
    async (data: {
      medicineId: bigint;
      quantity: bigint;
      patientName: string;
      saleDate: string;
    }): Promise<StoreSale | null> => {
      const med = medicines.find((m) => m.id === data.medicineId);
      if (!med) return null;
      const qty = Number(data.quantity);
      if (qty > Number(med.quantity)) return null;
      const totalPrice = +(med.salePrice * qty).toFixed(2);
      const id = nextSaleId.current++;
      const sale: StoreSale = {
        id,
        medicineId: data.medicineId,
        medicineName: `${med.name} ${med.dosage}`,
        category: med.category,
        quantity: data.quantity,
        salePrice: med.salePrice,
        totalPrice,
        patientName: data.patientName,
        saleDate: data.saleDate,
        purchasePrice: med.purchasePrice,
      };
      setSales((prev) => [sale, ...prev]);
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === data.medicineId
            ? { ...m, quantity: BigInt(Number(m.quantity) - qty) }
            : m,
        ),
      );
      try {
        if (actor)
          await actor.recordSale(
            data.medicineId,
            data.quantity,
            data.patientName,
            data.saleDate,
          );
      } catch {
        /* silent */
      }
      return sale;
    },
    [actor, medicines],
  );

  const totalRevenue = useMemo(
    () => sales.reduce((acc, s) => acc + s.totalPrice, 0),
    [sales],
  );
  const totalMedicines = medicines.length;
  const totalSales = sales.length;

  return (
    <PharmacyStoreContext.Provider
      value={{
        medicines,
        suppliers,
        sales,
        totalRevenue,
        totalMedicines,
        totalSales,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        recordSale,
      }}
    >
      {children}
    </PharmacyStoreContext.Provider>
  );
}

export function usePharmacyStore() {
  const ctx = useContext(PharmacyStoreContext);
  if (!ctx)
    throw new Error(
      "usePharmacyStore must be used within PharmacyStoreProvider",
    );
  return ctx;
}
