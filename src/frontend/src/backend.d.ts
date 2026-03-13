import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AnalyticsSummary {
    totalSales: bigint;
    totalMedicines: bigint;
    totalRevenue: number;
}
export interface Medicine {
    id: bigint;
    purchasePrice: number;
    dosage: string;
    expiryDate: string;
    name: string;
    quantity: bigint;
    category: string;
    salePrice: number;
    isNearExpiry: boolean;
    supplierId: bigint;
}
export interface SalesTrend {
    month: string;
    totalSales: bigint;
    totalRevenue: number;
}
export interface Supplier {
    id: bigint;
    contact: string;
    name: string;
}
export interface Sale {
    id: bigint;
    purchasePrice: number;
    patientName: string;
    quantity: bigint;
    category: string;
    salePrice: number;
    totalPrice: number;
    medicineId: bigint;
    saleDate: string;
    medicineName: string;
}
export interface CategoryDemand {
    feb: bigint;
    jan: bigint;
    mar: bigint;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMedicine(name: string, category: string, dosage: string, quantity: bigint, supplierId: bigint, purchasePrice: number, salePrice: number, expiryDate: string, isNearExpiry: boolean): Promise<Medicine>;
    addSupplier(name: string, contact: string): Promise<Supplier>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMedicine(id: bigint): Promise<boolean>;
    deleteSupplier(id: bigint): Promise<boolean>;
    getAnalyticsSummary(): Promise<AnalyticsSummary>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryDemand(): Promise<Array<CategoryDemand>>;
    getMedicines(): Promise<Array<Medicine>>;
    getMonthlySalesTrend(): Promise<Array<SalesTrend>>;
    getNearExpiryAlerts(): Promise<Array<Medicine>>;
    getSales(): Promise<Array<Sale>>;
    getSuppliers(): Promise<Array<Supplier>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    recordSale(medicineId: bigint, quantity: bigint, patientName: string, saleDate: string): Promise<Sale | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMedicine(id: bigint, name: string, category: string, dosage: string, quantity: bigint, supplierId: bigint, purchasePrice: number, salePrice: number, expiryDate: string, isNearExpiry: boolean): Promise<Medicine | null>;
    updateSupplier(id: bigint, name: string, contact: string): Promise<Supplier | null>;
}
