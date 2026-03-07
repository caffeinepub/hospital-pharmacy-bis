import { useIsAdmin } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  Pill,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    path: "/inventory",
    label: "Inventory",
    icon: Pill,
    ocid: "nav.inventory.link",
  },
  {
    path: "/sales",
    label: "Sales",
    icon: ShoppingCart,
    ocid: "nav.sales.link",
  },
  {
    path: "/suppliers",
    label: "Suppliers",
    icon: Truck,
    ocid: "nav.suppliers.link",
  },
  {
    path: "/alerts",
    label: "Alerts",
    icon: AlertTriangle,
    ocid: "nav.alerts.link",
  },
];

export function Sidebar() {
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-[15px] font-800 leading-tight text-black tracking-tight">
              PharmaCare BIS
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Hospital Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                data-ocid={item.ocid}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all duration-150",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-black",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4.5 h-4.5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-500",
                  )}
                  size={18}
                />
                {item.label}
                {item.path === "/alerts" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-200">
        {isAdmin && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[12px] font-700 text-blue-700">
              Admin Access
            </span>
          </div>
        )}
        <div className="text-[11px] text-slate-400 text-center">
          ferialsameh599@gmail.com
        </div>
      </div>
    </aside>
  );
}
