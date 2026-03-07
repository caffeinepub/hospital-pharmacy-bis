import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Medicine, Sale, Supplier } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  medicines: ["medicines"] as const,
  suppliers: ["suppliers"] as const,
  sales: ["sales"] as const,
  nearExpiry: ["nearExpiry"] as const,
  monthlySalesTrend: ["monthlySalesTrend"] as const,
  categoryDemand: ["categoryDemand"] as const,
  analyticsSummary: ["analyticsSummary"] as const,
  isAdmin: ["isAdmin"] as const,
  userRole: ["userRole"] as const,
};

// ─── Read Queries ────────────────────────────────────────────────────────────
export function useMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: QUERY_KEYS.medicines,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMedicines();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSuppliers() {
  const { actor, isFetching } = useActor();
  return useQuery<Supplier[]>({
    queryKey: QUERY_KEYS.suppliers,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuppliers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSales() {
  const { actor, isFetching } = useActor();
  return useQuery<Sale[]>({
    queryKey: QUERY_KEYS.sales,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSales();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useNearExpiryAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: QUERY_KEYS.nearExpiry,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearExpiryAlerts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMonthlySalesTrend() {
  const { actor, isFetching } = useActor();
  return useQuery<
    { month: string; totalSales: bigint; totalRevenue: number }[]
  >({
    queryKey: QUERY_KEYS.monthlySalesTrend,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlySalesTrend();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCategoryDemand() {
  const { actor, isFetching } = useActor();
  return useQuery<
    { category: string; jan: bigint; feb: bigint; mar: bigint }[]
  >({
    queryKey: QUERY_KEYS.categoryDemand,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategoryDemand();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAnalyticsSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalMedicines: bigint;
    totalSales: bigint;
    totalRevenue: number;
  }>({
    queryKey: QUERY_KEYS.analyticsSummary,
    queryFn: async () => {
      if (!actor)
        return { totalMedicines: 0n, totalSales: 0n, totalRevenue: 0 };
      return actor.getAnalyticsSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: QUERY_KEYS.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.userRole,
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────
export function useAddMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      dosage: string;
      quantity: bigint;
      supplierId: bigint;
      unitPrice: number;
      expiryDate: string;
      isNearExpiry: boolean;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.addMedicine(
        data.name,
        data.category,
        data.dosage,
        data.quantity,
        data.supplierId,
        data.unitPrice,
        data.expiryDate,
        data.isNearExpiry,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analyticsSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nearExpiry });
    },
  });
}

export function useUpdateMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      dosage: string;
      quantity: bigint;
      supplierId: bigint;
      unitPrice: number;
      expiryDate: string;
      isNearExpiry: boolean;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.updateMedicine(
        data.id,
        data.name,
        data.category,
        data.dosage,
        data.quantity,
        data.supplierId,
        data.unitPrice,
        data.expiryDate,
        data.isNearExpiry,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nearExpiry });
    },
  });
}

export function useDeleteMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deleteMedicine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analyticsSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nearExpiry });
    },
  });
}

export function useAddSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; contact: string }) => {
      if (!actor) throw new Error("No actor available");
      return actor.addSupplier(data.name, data.contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suppliers });
    },
  });
}

export function useUpdateSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; contact: string }) => {
      if (!actor) throw new Error("No actor available");
      return actor.updateSupplier(data.id, data.name, data.contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suppliers });
    },
  });
}

export function useDeleteSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deleteSupplier(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suppliers });
    },
  });
}

export function useRecordSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      medicineId: bigint;
      quantity: bigint;
      patientName: string;
      saleDate: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.recordSale(
        data.medicineId,
        data.quantity,
        data.patientName,
        data.saleDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sales });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analyticsSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monthlySalesTrend });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categoryDemand });
    },
  });
}
