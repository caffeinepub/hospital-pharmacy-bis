import { useIsAdmin } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  FileText,
  LayoutDashboard,
  Pill,
  Shield,
  ShoppingCart,
  Truck,
  X,
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
    label: "Medicines",
    icon: Pill,
    ocid: "nav.medicines.link",
  },
  {
    path: "/suppliers",
    label: "Suppliers",
    icon: Truck,
    ocid: "nav.suppliers.link",
  },
  {
    path: "/sales",
    label: "Sales",
    icon: ShoppingCart,
    ocid: "nav.sales.link",
  },
  {
    path: "/reports",
    label: "Reports",
    icon: FileText,
    ocid: "nav.reports.link",
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();

  return (
    <aside className="w-64 min-h-screen h-full bg-black border-r border-zinc-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-display text-[15px] font-800 leading-tight text-white tracking-tight">
              PharmaCare BIS
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Hospital Analytics
            </div>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all duration-150",
                  isActive
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4.5 h-4.5 flex-shrink-0",
                    isActive ? "text-black" : "text-zinc-500",
                  )}
                  size={18}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-zinc-800 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <span className="text-[12px] font-700 text-white">
            {isAdmin ? "Admin Access" : "Primary Admin"}
          </span>
        </div>
        <div className="text-[11px] text-zinc-400 text-center leading-relaxed">
          ferialsameh599@gmail.com
        </div>
      </div>
    </aside>
  );
}
