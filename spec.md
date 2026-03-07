# Hospital Pharmacy Management System (BIS Analytics)

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full Hospital Pharmacy Management System with Clean Architecture
- Pre-seeded medicines inventory (20+ medicines across 4 categories)
- Pre-seeded suppliers (Ibn Sina, Pharma Overseas, United Pharma, Al-Ezaby)
- 50 historical sales records from Jan–Mar 2026 for analytics
- Admin user: ferialsameh599@gmail.com set as Primary Admin
- Analytics dashboard with Bar Charts (sales trends) and Line Charts (demand forecasting)
- Near Expiry red alert for Augmentin 1g and ConCor 5mg
- Inventory CRUD (Add/Edit/Delete medicines) — stable, no page refresh
- Sales management (record new sales, view history)
- Supplier management CRUD
- Authorization-gated admin panel

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
1. Medicine entity: id, name, category, dosage, quantity, supplierId, expiryDate, unitPrice, isNearExpiry flag
2. Supplier entity: id, name, contact
3. Sale entity: id, medicineId, medicineName, quantity, totalPrice, saleDate, patientName
4. Functions:
   - getMedicines, addMedicine, updateMedicine, deleteMedicine
   - getSuppliers, addSupplier, updateSupplier, deleteSupplier
   - getSales, recordSale
   - getAnalyticsSummary (monthly totals, top medicines)
   - getNearExpiryAlerts
   - initializeData (seeds all pre-filled data on first run)
5. Stable var storage so data persists across upgrades

### Frontend (React + TypeScript)
1. Layout: Sidebar nav with pages: Dashboard/Analytics, Inventory, Sales, Suppliers, Alerts
2. Dashboard/Analytics page:
   - KPI cards (total medicines, total sales, revenue)
   - Interactive Bar Chart: monthly sales volume Jan–Mar 2026
   - Line Chart: demand forecasting trend per medicine category
   - All chart labels, legends, tick text in pure black (#000000) bold
3. Inventory page: Table of all medicines, Add/Edit/Delete modals (no page refresh)
4. Sales page: Record new sale form + sales history table
5. Suppliers page: Supplier list with CRUD modals
6. Alerts page: Red-highlighted near-expiry alerts for Augmentin 1g and ConCor 5mg
7. Light mode only (white background throughout)
8. All table text, labels pure black and bold
9. Authorization: admin-only access to CRUD operations
10. Charts library: Recharts (already available in project)
