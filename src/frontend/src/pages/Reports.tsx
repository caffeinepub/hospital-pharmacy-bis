import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePharmacy } from "../contexts/PharmacyStore";

export function Reports() {
  const {
    totalRevenue,
    totalSales,
    totalMedicines,
    totalSuppliers,
    topSellingMedicines,
    monthlyRevenue,
    monthlySales,
    nearExpiryMedicines,
    lowStockMedicines,
  } = usePharmacy();

  const GREY_COLORS = ["#000", "#333", "#555", "#777", "#999"];

  return (
    <div className="p-4 md:p-6 space-y-6 md:ml-0 ml-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black font-display">
            Reports
          </h1>
          <p className="text-sm text-gray-500 font-semibold">
            Analytics &amp; Performance Summary
          </p>
        </div>
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white font-bold no-print"
          data-ocid="reports.print.button"
        >
          <Printer className="w-4 h-4 mr-2" /> Print / Export PDF
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Medicines", value: String(totalMedicines) },
          { label: "Total Sales", value: String(totalSales) },
          {
            label: "Total Revenue",
            value: `${totalRevenue.toLocaleString()} EGP`,
          },
          { label: "Total Suppliers", value: String(totalSuppliers) },
        ].map((kpi) => (
          <Card key={kpi.label} className="border border-gray-200 shadow-none">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-black">{kpi.value}</p>
              <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">
                {kpi.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Monthly Revenue (EGP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }}
                />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {monthlyRevenue.map((entry, i) => (
                    <Cell
                      key={entry.month}
                      fill={i % 2 === 0 ? "#000" : "#555"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Monthly Sales Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }}
                />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#000"
                  strokeWidth={2.5}
                  dot={{ fill: "#000", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Sellers */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-black">
            Top 5 Selling Medicines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={topSellingMedicines}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fontWeight: 700, fill: "#000" }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  fontWeight: 700,
                }}
              />
              <Bar dataKey="qty" radius={[0, 4, 4, 0]}>
                {topSellingMedicines.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={GREY_COLORS[i % GREY_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-red-200 bg-red-50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-red-800">
              Low Stock ({lowStockMedicines.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockMedicines.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold">
                All stock levels healthy
              </p>
            ) : (
              <ul className="space-y-1">
                {lowStockMedicines.map((m) => (
                  <li key={m.id} className="flex justify-between text-xs">
                    <span className="font-semibold text-red-700">{m.name}</span>
                    <span className="font-bold text-red-900">
                      {m.quantity} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-amber-800">
              Near Expiry ({nearExpiryMedicines.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nearExpiryMedicines.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold">
                No items expiring soon
              </p>
            ) : (
              <ul className="space-y-1">
                {nearExpiryMedicines.map((m) => (
                  <li key={m.id} className="flex justify-between text-xs">
                    <span className="font-semibold text-amber-700">
                      {m.name}
                    </span>
                    <span className="font-bold text-amber-900">
                      {m.expiryDate}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-gray-400 pt-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
