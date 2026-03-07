import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalyticsSummary,
  useCategoryDemand,
  useMonthlySalesTrend,
  useNearExpiryAlerts,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = {
  Hypertension: "#2563eb",
  Antibiotics: "#dc2626",
  Diabetes: "#16a34a",
  "Ulcer & Others": "#ea580c",
};

const TICK_STYLE = { fill: "#000000", fontWeight: 700, fontSize: 12 };
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#000000",
    fontWeight: 700,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  labelStyle: { color: "#000000", fontWeight: 700 },
  itemStyle: { color: "#000000", fontWeight: 600 },
};

export function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: salesTrend, isLoading: trendLoading } = useMonthlySalesTrend();
  const { data: categoryDemand, isLoading: demandLoading } =
    useCategoryDemand();
  const { data: nearExpiry } = useNearExpiryAlerts();

  const barData = (salesTrend ?? []).map((item) => ({
    month: item.month,
    Revenue: item.totalRevenue,
    Sales: Number(item.totalSales),
  }));

  const lineData = (() => {
    const months = ["Jan", "Feb", "Mar"];
    return months.map((m) => {
      const row: Record<string, string | number> = { month: m };
      for (const cat of categoryDemand ?? []) {
        if (m === "Jan") row[cat.category] = Number(cat.jan);
        else if (m === "Feb") row[cat.category] = Number(cat.feb);
        else if (m === "Mar") row[cat.category] = Number(cat.mar);
      }
      return row;
    });
  })();

  const categories = (categoryDemand ?? []).map((c) => c.category);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const kpis = [
    {
      label: "Total Medicines",
      value: summaryLoading ? null : Number(summary?.totalMedicines ?? 0),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: "Total Sales",
      value: summaryLoading ? null : Number(summary?.totalSales ?? 0),
      icon: ShoppingCart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: "Total Revenue",
      value: summaryLoading ? null : (summary?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
      format: (v: number) => formatCurrency(v),
    },
    {
      label: "Near Expiry",
      value: summaryLoading ? null : (nearExpiry?.length ?? 0),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      format: (v: number) => v.toString(),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            Hospital Pharmacy Business Intelligence System — Jan–Mar 2026
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-[13px] font-700 text-white">BIS Report</span>
        </div>
      </div>

      {/* Near Expiry Alert Banner */}
      {nearExpiry && nearExpiry.length > 0 && (
        <div
          data-ocid="dashboard.summary.card"
          className="flex items-center gap-3 px-5 py-4 bg-red-600 rounded-xl text-white shadow-sm"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-700 text-[14px]">NEAR EXPIRY ALERT: </span>
            <span className="font-600 text-[13.5px]">
              {nearExpiry.map((m) => `${m.name} ${m.dosage}`).join(" and ")}{" "}
              {nearExpiry.length === 1 ? "is" : "are"} near expiry! Immediate
              action required.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            data-ocid="dashboard.summary.card"
            className="bg-white border-slate-200 shadow-xs"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-700 text-slate-500 uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  {kpi.value === null ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-2xl font-display font-800 text-black leading-none">
                      {kpi.format(kpi.value)}
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Sales Trend Bar Chart */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-600" />
              Monthly Sales Trend (Revenue)
            </CardTitle>
            <p className="text-[12px] text-slate-500 font-medium">
              Jan–Mar 2026
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {trendLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={barData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  data-ocid="dashboard.bar_chart.chart_point"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={TICK_STYLE}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{
                      color: "#000000",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="Revenue"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                    name="Revenue (USD)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Demand Forecasting Line Chart */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-600" />
              Category Demand Forecasting
            </CardTitle>
            <p className="text-[12px] text-slate-500 font-medium">
              Units sold by category
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {demandLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={lineData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  data-ocid="dashboard.line_chart.chart_point"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={TICK_STYLE}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend
                    wrapperStyle={{
                      color: "#000000",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  />
                  {categories.map((cat) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stroke={
                        CHART_COLORS[cat as keyof typeof CHART_COLORS] ??
                        "#6366f1"
                      }
                      strokeWidth={2.5}
                      dot={{
                        fill:
                          CHART_COLORS[cat as keyof typeof CHART_COLORS] ??
                          "#6366f1",
                        r: 5,
                      }}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Count Bar Chart */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            Monthly Transaction Volume
          </CardTitle>
          <p className="text-[12px] text-slate-500 font-medium">
            Number of sales transactions per month
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          {trendLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={barData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={TICK_STYLE}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="Sales"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
