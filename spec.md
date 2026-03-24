# Hospital Pharmacy BIS

## Current State

Full-stack pharmacy management system with:
- React + TypeScript frontend, Motoko backend
- AuthContext with email/password login (admin@pharmacy.com / admin123 default)
- PharmacyStore context with Medicines, Suppliers, Sales state and static seed data
- Pages: LoginPage, Dashboard, Inventory (Medicines), Suppliers, Sales, Reports, Alerts
- Sidebar navigation, responsive layout
- Duplicate validation for medicines and suppliers
- Sales form with medicine dropdown, stock validation, stock reduction on save
- Charts (bar, line) for analytics
- KPI cards, AI Insights, near-expiry alerts

## Requested Changes (Diff)

### Add
- Ensure dashboard metrics (revenue, sales count, stock levels) auto-update after every CRUD operation
- Ensure top-selling medicines chart auto-updates after every sale/edit/delete
- Ensure sales and revenue analytics charts update in real-time after any operation
- Success toast messages: "Item added/edited successfully", "Medicine added successfully", etc.
- Edit invoice functionality in Sales page

### Modify
- Login page: use email + password fields (not username), validate against Users table, show "Invalid email or password" on failure
- AuthContext: seed default admin (admin@pharmacy.com / admin123) if Users table is empty; store current user role
- Admin-only: Add/Edit/Delete buttons for medicines, suppliers, invoices only visible/functional when role === 'admin'
- Non-admin users: view-only dashboard, no CRUD controls visible
- Medicines form: fields = Medicine Name, Category, Quantity, Price, Expiry Date, Supplier; duplicate check case-insensitive
- Sales form: medicine dropdown loads from PharmacyStore medicines with stock; auto-fill price; validate qty <= stock; total = qty * price; reduce stock on save; no DOM/insertBefore errors
- All CRUD handlers must call PharmacyStore update functions that trigger React state re-renders so all derived analytics recalculate automatically
- Remove any direct DOM manipulation (insertBefore, innerHTML, etc.) -- use React state only

### Remove
- Any direct DOM manipulation code (insertBefore, etc.)
- Any hardcoded analytics that don't reactively update from state

## Implementation Plan

1. **AuthContext**: Ensure Users table has default admin seed; expose currentUser with role; protect routes -- redirect to /login if not authenticated
2. **PharmacyStore**: Ensure all state updates trigger re-renders; derived analytics (totalRevenue, totalSales, topSelling, stockLevels) computed from state reactively; expose addSale, updateMedicine, deleteMedicine, addMedicine, addSupplier, updateSupplier, deleteSupplier, addInvoice, updateInvoice with proper duplicate checks
3. **LoginPage**: email + password fields; validate against Users; show error on fail; redirect on success
4. **Inventory (Medicines)**: Add/Edit/Delete with all fields (Name, Category, Quantity, Price, Expiry Date, Supplier); admin-only controls; duplicate check; success/error messages via toast
5. **Suppliers**: Add/Edit/Delete; admin-only; duplicate check; success/error toasts
6. **Sales**: Add/Edit invoices; medicine dropdown from store; auto-fill price + stock display; qty validation; total auto-calc; stock reduction on save; success/error toasts; no DOM errors
7. **Dashboard**: All KPIs and charts derived from PharmacyStore state -- auto-update on any change; date filter works on derived data
8. **General**: Remove all direct DOM manipulation; use React state/derived values exclusively; add `data-ocid` markers to all interactive surfaces
