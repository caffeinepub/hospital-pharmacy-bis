# Hospital Pharmacy BIS — Final Production Build

## Current State
- Backend `initializeData()` is admin-only, so data is never seeded for unauthenticated users
- Backend seeds generic placeholder names ("Medicine 1", "Supplier 1") and wrong dates ("2024-06-01")
- `getCategoryDemand()` does not parse month from `saleDate`; all sales go to `jan` bucket regardless
- `getMonthlySalesTrend()` groups by full saleDate string, not by month label
- Frontend tables (Inventory, Sales, Suppliers) show empty state because backend returns empty arrays
- Dashboard charts use static fallback data but tables are blank
- No static fallback data exists in the table pages themselves

## Requested Changes (Diff)

### Add
- Backend: `initializeData()` is now a **public** function (no auth gate) that self-seeds on first call using an `initialized` flag
- Backend: Real 24-medicine inventory with correct names, categories, dosages, prices, supplier IDs
- Backend: 4 real suppliers: Ibn Sina, Pharma Overseas, United Pharma, Al-Ezaby
- Backend: 50 real sales records spread across Jan 2026, Feb 2026, and Mar 2026 with realistic dates
- Backend: Augmentin 1g and ConCor 5mg flagged `isNearExpiry = true` with expiry dates within 30 days of today
- Backend: Fix `getCategoryDemand()` to parse month from `saleDate` (format "YYYY-MM-DD") correctly for jan/feb/mar buckets
- Backend: Fix `getMonthlySalesTrend()` to extract "Jan 2026"/"Feb 2026"/"Mar 2026" month labels from saleDate
- Frontend: Static hardcoded fallback arrays in Inventory, Sales, and Suppliers pages that render IMMEDIATELY before the backend query resolves — ensuring tables are NEVER empty on load
- Frontend: Merge logic: show static data if backend returns 0 items, otherwise show backend data

### Modify
- Backend: `initializeData()` — remove admin auth requirement, add idempotency guard (`initialized` flag)
- Frontend: `Inventory.tsx` — add `STATIC_MEDICINES` array of 24 items; display them when `medicines` is empty/loading
- Frontend: `Sales.tsx` — add `STATIC_SALES` array of 50 items; display them when `sales` is empty/loading
- Frontend: `Suppliers.tsx` — add `STATIC_SUPPLIERS` array of 4 items; display them when `suppliers` is empty/loading
- Frontend: `App.tsx` — call `initializeData()` without requiring admin (will succeed for any caller now)

### Remove
- Backend: Admin-only guard on `initializeData()`
- Backend: Placeholder data ("Medicine N", "Category A/B/C", "Supplier N")

## Implementation Plan
1. Rewrite `main.mo`: fix `initializeData` to be public with idempotency flag, inject all 24 real medicines, 4 real suppliers, 50 realistic sales records (Jan–Mar 2026), fix analytics aggregation functions
2. Rewrite `Inventory.tsx`: add 24-medicine static fallback array; use it when backend returns empty
3. Rewrite `Sales.tsx`: add 50-sale static fallback array; use it when backend returns empty; show total revenue from static data
4. Rewrite `Suppliers.tsx`: add 4-supplier static fallback; use it when backend returns empty
5. Keep `Dashboard.tsx` static fallback as-is (already working)
6. Validate and deploy
