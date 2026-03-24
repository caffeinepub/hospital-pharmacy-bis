import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Medicines", path: "/inventory", icon: FlaskConical },
  { label: "Suppliers", path: "/suppliers", icon: Truck },
  { label: "Sales", path: "/sales", icon: ShoppingCart },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNav(path: string) {
    navigate({ to: path });
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-sm">Rx</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">PharmaCare BIS</p>
            <p className="text-xs text-white/50">Hospital Pharmacy</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-ocid="nav.section">
        {NAV_ITEMS.map((item) => {
          const active = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              data-ocid={`nav.${item.label.toLowerCase()}.link`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        {currentUser && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-bold text-white truncate">
              {currentUser.email}
            </p>
            <span
              className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentUser.role === "admin"
                  ? "bg-white text-black"
                  : "bg-white/20 text-white"
              }`}
            >
              {currentUser.role === "admin" ? "Admin" : "Viewer"}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          data-ocid="nav.logout_button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-gray-200 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
          data-ocid="nav.mobile_menu_button"
        >
          <Menu className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 flex flex-col">{sidebarContent}</div>
            <button
              type="button"
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="absolute top-4 right-4 w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
