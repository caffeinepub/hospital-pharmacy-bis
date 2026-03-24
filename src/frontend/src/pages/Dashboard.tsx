import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart2,
  Brain,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
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

const DATE_FILTERS = ["Today", "This Week", "This Month", "This Year"] as const;
type DateFilter = (typeof DATE_FILTERS)[number];

function isInRange(dateStr: string, filter: DateFilter): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  if (filter === "Today") {
    return d.toDateString() === now.toDateString();
  }
  if (filter === "This Week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return d >= start;
  }
  if (filter === "This Month") {
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }
  // This Year
  return d.getFullYear() === now.getFullYear();
}

export function Dashboard() {
  const {
    sales,
    totalMedicines,
    lowStockMedicines,
    nearExpiryMedicines,
    topSellingMedicines,
    monthlyRevenue,
    monthlySales,
  } = usePharmacy();

  const [dateFilter, setDateFilter] = useState<DateFilter>("This Month");

  const filteredSales = useMemo(
    () => sales.filter((s) => isInRange(s.date, dateFilter)),
    [sales, dateFilter],
  );

  const filteredRevenue = useMemo(
    () => filteredSales.reduce((sum, s) => sum + s.total, 0),
    [filteredSales],
  );

  // Sales growth vs previous month
  const salesGrowth = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    const thisRev = sales
      .filter((s) => s.date.startsWith(thisMonth))
      .reduce((sum, s) => sum + s.total, 0);
    const prevRev = sales
      .filter((s) => s.date.startsWith(prevMonth))
      .reduce((sum, s) => sum + s.total, 0);
    if (prevRev === 0) return 0;
    return Math.round(((thisRev - prevRev) / prevRev) * 100);
  }, [sales]);

  const aiInsights = useMemo(
    () => [
      {
        title: "Stock-Out Risk",
        value: `${lowStockMedicines.length} items`,
        desc:
          lowStockMedicines.length > 0
            ? `${lowStockMedicines
                .map((m) => m.name)
                .slice(0, 2)
                .join(", ")} running low`
            : "All stock levels healthy",
        icon: "⚠️",
      },
      {
        title: "Expiry Warning",
        value: `${nearExpiryMedicines.length} items`,
        desc:
          nearExpiryMedicines.length > 0
            ? "Expires within 90 days"
            : "No items expiring soon",
        icon: "📅",
      },
      {
        title: "Demand Surge",
        value: topSellingMedicines[0]?.name ?? "N/A",
        desc: topSellingMedicines[0]
          ? `${topSellingMedicines[0].qty} units sold`
          : "No sales data",
        icon: "📈",
      },
      {
        title: "Revenue Insight",
        value: `${filteredRevenue.toLocaleString()} EGP`,
        desc: `${dateFilter} performance`,
        icon: "💰",
      },
      {
        title: "Demand Forecast",
        value: salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
        desc: "Sales growth vs last month",
        icon: "🔮",
      },
      {
        title: "Stock Health",
        value: `${Math.round(((totalMedicines - lowStockMedicines.length) / totalMedicines) * 100)}%`,
        desc: "Inventory health score",
        icon: "✅",
      },
    ],
    [
      lowStockMedicines,
      nearExpiryMedicines,
      topSellingMedicines,
      filteredRevenue,
      dateFilter,
      salesGrowth,
      totalMedicines,
    ],
  );

  const GREY_COLORS = ["#000", "#333", "#555", "#777", "#999"];

  return (
    <div className="p-4 md:p-6 space-y-6 md:ml-0 ml-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black font-display">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-0.5">
            Hospital Pharmacy Analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-2" data-ocid="dashboard.filter.tab">
          {DATE_FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                dateFilter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-ocid={`dashboard.${f.toLowerCase().replace(" ", "_")}.tab`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4"
        data-ocid="dashboard.kpi.section"
      >
        <KpiCard
          label="Total Medicines"
          value={String(totalMedicines)}
          icon={<Package className="w-5 h-5" />}
        />
        <KpiCard
          label="Total Sales"
          value={String(filteredSales.length)}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <KpiCard
          label="Revenue (EGP)"
          value={filteredRevenue.toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KpiCard
          label="Expiring Soon"
          value={String(nearExpiryMedicines.length)}
          icon={<AlertTriangle className="w-5 h-5" />}
          alert={nearExpiryMedicines.length > 0}
        />
        <KpiCard
          label="Sales Growth"
          value={salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`}
          icon={<BarChart2 className="w-5 h-5" />}
        />
      </div>

      {/* Alerts Row */}
      {(lowStockMedicines.length > 0 || nearExpiryMedicines.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {lowStockMedicines.length > 0 && (
            <AlertBox
              title="Low Stock Alerts"
              items={lowStockMedicines.map((m) => ({
                label: m.name,
                value: `${m.quantity} left`,
              }))}
              color="red"
            />
          )}
          {nearExpiryMedicines.length > 0 && (
            <AlertBox
              title="Near Expiry Alerts"
              items={nearExpiryMedicines.map((m) => ({
                label: m.name,
                value: m.expiryDate,
              }))}
              color="orange"
            />
          )}
        </div>
      )}

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
              <BarChart
                data={monthlyRevenue}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
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
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                  formatter={(v: number) => [
                    `${v.toLocaleString()} EGP`,
                    "Revenue",
                  ]}
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
              <LineChart
                data={monthlySales}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
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
                    borderRadius: 8,
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

      {/* Top Selling Medicines */}
      <div className="grid xl:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Top Selling Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={topSellingMedicines}
                layout="vertical"
                margin={{ top: 0, right: 8, bottom: 0, left: 60 }}
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
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
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

        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Top Sellers Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-bold text-black">#</th>
                  <th className="text-left py-2 font-bold text-black">
                    Medicine
                  </th>
                  <th className="text-right py-2 font-bold text-black">
                    Units Sold
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSellingMedicines.map((m, i) => (
                  <tr
                    key={m.name}
                    className="border-b border-gray-100"
                    data-ocid={`dashboard.top_medicine.row.${i + 1}`}
                  >
                    <td className="py-2 font-bold text-gray-500">{i + 1}</td>
                    <td className="py-2 font-semibold text-black">{m.name}</td>
                    <td className="py-2 text-right font-bold text-black">
                      {m.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-black" />
          <h2 className="text-base font-bold text-black font-display">
            AI Insights
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, i) => (
            <div
              key={insight.title}
              className="border border-gray-200 rounded-xl p-4 bg-white"
              data-ocid={`dashboard.insight.card.${i + 1}`}
            >
              <div className="text-2xl mb-2">{insight.icon}</div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {insight.title}
              </p>
              <p className="text-lg font-bold text-black mt-1">
                {insight.value}
              </p>
              <p className="text-xs text-gray-600 mt-0.5 font-semibold">
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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

function KpiCard({
  label,
  value,
  icon,
  alert,
}: { label: string; value: string; icon: React.ReactNode; alert?: boolean }) {
  return (
    <Card
      className={`border shadow-none ${alert ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
      data-ocid="dashboard.kpi.card"
    >
      <CardContent className="p-4">
        <div
          className={`flex items-center justify-between mb-2 ${alert ? "text-red-600" : "text-gray-500"}`}
        >
          {icon}
        </div>
        <p
          className={`text-2xl font-bold ${alert ? "text-red-700" : "text-black"}`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-bold mt-1 ${alert ? "text-red-500" : "text-gray-500"}`}
        >
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

function AlertBox({
  title,
  items,
  color,
}: {
  title: string;
  items: { label: string; value: string }[];
  color: "red" | "orange";
}) {
  const cls =
    color === "red"
      ? {
          bg: "bg-red-50",
          border: "border-red-200",
          title: "text-red-800",
          item: "text-red-700",
          badge: "bg-red-200 text-red-900",
        }
      : {
          bg: "bg-amber-50",
          border: "border-amber-200",
          title: "text-amber-800",
          item: "text-amber-700",
          badge: "bg-amber-200 text-amber-900",
        };
  return (
    <div className={`rounded-xl border p-4 ${cls.bg} ${cls.border}`}>
      <p
        className={`text-xs font-bold uppercase tracking-wide mb-3 ${cls.title}`}
      >
        {title}
      </p>
      <div className="space-y-1">
        {items.slice(0, 5).map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${cls.item}`}>
              {item.label}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold ${cls.badge} border-0`}
            >
              {item.value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
