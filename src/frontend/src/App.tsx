import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PharmacyStoreProvider } from "./contexts/PharmacyStore";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { LoginPage } from "./pages/LoginPage";
import { Reports } from "./pages/Reports";
import { Sales } from "./pages/Sales";
import { Suppliers } from "./pages/Suppliers";

function RedirectToLogin() {
  useEffect(() => {
    router.navigate({ to: "/login" });
  }, []);
  return null;
}

function ProtectedLayout() {
  const { currentUser } = useAuth();
  if (!currentUser) return <RedirectToLogin />;
  return <Layout />;
}

const rootRoute = createRootRoute({ component: Outlet });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Dashboard,
});

const inventoryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/inventory",
  component: Inventory,
});

const salesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/sales",
  component: Sales,
});

const suppliersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/suppliers",
  component: Suppliers,
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: Reports,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    inventoryRoute,
    salesRoute,
    suppliersRoute,
    reportsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <PharmacyStoreProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#000000",
              fontWeight: 700,
              border: "1px solid #e2e8f0",
              fontSize: "13px",
            },
          }}
        />
      </AuthProvider>
    </PharmacyStoreProvider>
  );
}
