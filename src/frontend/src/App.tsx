import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { PharmacyStoreProvider } from "./contexts/PharmacyStore";
import { useActor } from "./hooks/useActor";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Reports } from "./pages/Reports";
import { Sales } from "./pages/Sales";
import { Suppliers } from "./pages/Suppliers";

// ─── Loading screen while initializing ────────────────────────────────────────────────
function InitScreen({ status }: { status: "loading" | "error" | "done" }) {
  if (status === "done") return null;
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-800 font-display">Rx</span>
        </div>
        <h1 className="text-xl font-display font-800 text-black">
          PharmaCare BIS
        </h1>
        {status === "loading" ? (
          <>
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-[13px] font-600 text-slate-500">
              Initializing Hospital Pharmacy System…
            </p>
            <p className="text-[12px] text-slate-400 font-medium">
              Loading medicines, suppliers, and historical sales data
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-[13px] font-700 text-red-600">
              Initialization failed. Please refresh.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Root component with init logic ─────────────────────────────────────────────────
function Root() {
  const { actor, isFetching } = useActor();
  const [initStatus, setInitStatus] = useState<"loading" | "error" | "done">(
    "loading",
  );

  useEffect(() => {
    // If still fetching, wait
    if (isFetching) return;

    // No actor (unauthenticated) — show app immediately with local data
    if (!actor) {
      setInitStatus("done");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await actor.initializeData();
        if (!cancelled) setInitStatus("done");
      } catch (err) {
        console.warn("Init error (non-fatal):", err);
        if (!cancelled) setInitStatus("done");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  return (
    <>
      <InitScreen status={initStatus} />
      {initStatus === "done" && <Outlet />}
    </>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: Root });

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
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

// ─── App ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <PharmacyStoreProvider>
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
    </PharmacyStoreProvider>
  );
}
