import { Outlet } from "@tanstack/react-router";
import { Activity, Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-black text-white flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <button
            type="button"
            data-ocid="nav.hamburger.button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-black" />
            </div>
            <span className="font-display text-[14px] font-800 text-white tracking-tight">
              PharmaCare BIS
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
