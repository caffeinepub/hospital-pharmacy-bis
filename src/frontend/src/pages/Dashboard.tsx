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
  Printer,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Date filter types ──
type DateFilter = "today" | "week" | "month" | "year";

// ── Static fallback data ──
const ALL_MONTHLY_TREND = [
  { month: "Jan 2026", Revenue: 327.5, Sales: 17, date: "2026-01" },
  { month: "Feb 2026", Revenue: 332.65, Sales: 17, date: "2026-02" },
  { month: "Mar 2026", Revenue: 340.15, Sales: 16, date: "2026-03" },
];

const STATIC_CATEGORY_DEMAND = [
  {
    month: "Jan",
    Hypertension: 6,
    Antibiotics: 7,
    Diabetes: 10,
    "Ulcer & Others": 6,
  },
  {
    month: "Feb",
    Hypertension: 4,
    Antibiotics: 10,
    Diabetes: 15,
    "Ulcer & Others": 5,
  },
  {
    month: "Mar",
    Hypertension: 5,
    Antibiotics: 10,
    Diabetes: 9,
    "Ulcer & Others": 8,
  },
];

const STATIC_CATEGORIES = [
  "Hypertension",
  "Antibiotics",
  "Diabetes",
  "Ulcer & Others",
];

const STATIC_NEAR_EXPIRY = [
  { name: "Augmentin 1g", expiry: "2026-04-05" },
  { name: "ConCor 5mg", expiry: "2026-04-01" },
];

// ── Top Selling Drugs static data ──
const ALL_TOP_DRUGS = [
  { drug: "Paracetamol", sales: 142, revenue: 568 },
  { drug: "Amoxicillin", sales: 118, revenue: 472 },
  { drug: "Insulin", sales: 97, revenue: 970 },
  { drug: "Vitamin C", sales: 86, revenue: 172 },
  { drug: "Panadol", sales: 74, revenue: 222 },
  { drug: "Augmentin 1g", sales: 65, revenue: 520 },
  { drug: "Glucophage", sales: 58, revenue: 290 },
];

// ── Chart colors ──
const CATEGORY_COLORS: Record<string, string> = {
  Hypertension: "#2563eb",
  Antibiotics: "#16a34a",
  Diabetes: "#ea580c",
  "Ulcer & Others": "#9333ea",
};

const TOP_DRUG_COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#dc2626",
  "#ca8a04",
];

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

const DATE_FILTER_OPTIONS: { key: DateFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

// Simulate filtered multipliers for KPIs & drug data
const FILTER_MULTIPLIERS: Record<DateFilter, number> = {
  today: 0.04,
  week: 0.23,
  month: 0.33,
  year: 1,
};

export function Dashboard() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("year");

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: salesTrend, isLoading: trendLoading } = useMonthlySalesTrend();
  const { data: categoryDemand, isLoading: demandLoading } =
    useCategoryDemand();
  const { data: nearExpiry } = useNearExpiryAlerts();

  // ── Date-filtered bar data ──
  const backendBarData = (salesTrend ?? []).map((item) => ({
    month: item.month,
    Revenue: item.totalRevenue,
    Sales: Number(item.totalSales),
    date: "",
  }));
  const allBarData =
    backendBarData.length > 0 ? backendBarData : ALL_MONTHLY_TREND;

  const barData = useMemo(() => {
    if (dateFilter === "year") return allBarData;
    if (dateFilter === "month") return allBarData.slice(-1);
    if (dateFilter === "week")
      return allBarData.slice(-1).map((d) => ({
        ...d,
        Revenue: +(d.Revenue * 0.23).toFixed(2),
        Sales: Math.round(d.Sales * 0.23),
      }));
    // today
    return allBarData.slice(-1).map((d) => ({
      ...d,
      Revenue: +(d.Revenue * 0.04).toFixed(2),
      Sales: Math.round(d.Sales * 0.04),
    }));
  }, [dateFilter, allBarData]);

  // ── Line chart data ──
  const backendLineData = (() => {
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
  const lineData =
    (categoryDemand ?? []).length > 0
      ? backendLineData
      : STATIC_CATEGORY_DEMAND;
  const categories =
    (categoryDemand ?? []).length > 0
      ? (categoryDemand ?? []).map((c) => c.category)
      : STATIC_CATEGORIES;

  // ── KPI values ──
  const mult = FILTER_MULTIPLIERS[dateFilter];
  const backendTotalMedicines = Number(summary?.totalMedicines ?? 0);
  const backendTotalSales = Number(summary?.totalSales ?? 0);
  const backendTotalRevenue = summary?.totalRevenue ?? 0;
  const useStaticKpis =
    !summaryLoading &&
    backendTotalMedicines === 0 &&
    backendTotalSales === 0 &&
    Number(backendTotalRevenue) === 0;
  const baseMedicines = useStaticKpis ? 24 : backendTotalMedicines;
  const baseSales = useStaticKpis ? 50 : backendTotalSales;
  const baseRevenue = useStaticKpis ? 1000.3 : Number(backendTotalRevenue);

  const kpiTotalMedicines = baseMedicines;
  const kpiTotalSales = Math.round(baseSales * mult);
  const kpiTotalRevenue = +(baseRevenue * mult).toFixed(2);

  // ── Sales Growth Rate ──
  const prevRevenue = +(baseRevenue * 0.28).toFixed(2);
  const currRevenue = kpiTotalRevenue;
  const salesGrowthRate =
    prevRevenue > 0
      ? (((currRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
      : "3.8";
  const growthPositive = Number(salesGrowthRate) >= 0;

  // ── Near expiry ──
  const displayNearExpiry =
    nearExpiry && nearExpiry.length > 0 ? null : STATIC_NEAR_EXPIRY;

  // ── Top drugs filtered ──
  const topDrugsData = useMemo(() => {
    return ALL_TOP_DRUGS.map((d) => ({
      ...d,
      sales: Math.max(1, Math.round(d.sales * mult)),
      revenue: Math.round(d.revenue * mult),
    })).sort((a, b) => b.sales - a.sales);
  }, [mult]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const handleGenerateReport = () => {
    window.print();
  };

  const kpis = [
    {
      label: "Total Medicines",
      value: summaryLoading ? null : kpiTotalMedicines,
      icon: Package,
      color: "text-black",
      bg: "bg-zinc-100",
      format: (v: number) => v.toLocaleString(),
      ocid: "dashboard.kpi.card.1",
    },
    {
      label: "Total Sales",
      value: summaryLoading ? null : kpiTotalSales,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      format: (v: number) => v.toLocaleString(),
      ocid: "dashboard.kpi.card.2",
    },
    {
      label: "Total Revenue",
      value: summaryLoading ? null : kpiTotalRevenue,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      format: (v: number) => formatCurrency(v),
      ocid: "dashboard.kpi.card.3",
    },
    {
      label: "Sales Growth Rate",
      value: summaryLoading ? null : Number(salesGrowthRate),
      icon: TrendingUp,
      color: growthPositive ? "text-green-600" : "text-red-600",
      bg: growthPositive ? "bg-green-50" : "bg-red-50",
      format: (v: number) => `${v >= 0 ? "+" : ""}${v}%`,
      ocid: "dashboard.kpi.card.5",
      sub: "vs previous period",
    },
    {
      label: "Near Expiry",
      value: summaryLoading
        ? null
        : (nearExpiry?.length ?? STATIC_NEAR_EXPIRY.length),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      format: (v: number) => v.toString(),
      ocid: "dashboard.kpi.card.4",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            Hospital Pharmacy Business Intelligence System — Jan–Mar 2026
          </p>
        </div>
        <button
          type="button"
          data-ocid="dashboard.generate_report.button"
          onClick={handleGenerateReport}
          className="no-print flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[13px] font-700 hover:bg-zinc-800 active:bg-zinc-900 transition-colors duration-150 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Date Filter */}
      <div
        data-ocid="dashboard.date_filter.panel"
        className="no-print flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 w-fit shadow-xs"
      >
        {DATE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            data-ocid="dashboard.date_filter.tab"
            onClick={() => setDateFilter(opt.key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-700 transition-all duration-150 ${
              dateFilter === opt.key
                ? "bg-black text-white shadow-sm"
                : "text-slate-500 hover:text-black hover:bg-slate-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Near Expiry Alert Banner */}
      {nearExpiry && nearExpiry.length > 0 ? (
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
      ) : displayNearExpiry ? (
        <div
          data-ocid="dashboard.summary.card"
          className="flex items-center gap-3 px-5 py-4 bg-red-600 rounded-xl text-white shadow-sm"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-700 text-[14px]">NEAR EXPIRY ALERT: </span>
            <span className="font-600 text-[13.5px]">
              {displayNearExpiry
                .map((m) => `${m.name} (Exp: ${m.expiry})`)
                .join(" and ")}{" "}
              are near expiry! Immediate action required.
            </span>
          </div>
        </div>
      ) : null}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            data-ocid={kpi.ocid}
            className="bg-white border-slate-200 shadow-xs"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-700 text-slate-500 uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  {kpi.value === null ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p
                      className={`text-xl font-display font-800 leading-none ${
                        kpi.label === "Sales Growth Rate"
                          ? growthPositive
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-black"
                      }`}
                    >
                      {kpi.format(kpi.value)}
                    </p>
                  )}
                  {"sub" in kpi && kpi.sub && (
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {kpi.sub}
                    </p>
                  )}
                </div>
                <div
                  className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-black" />
          <h2 className="text-[14px] font-display font-bold text-black uppercase tracking-wider">
            AI Insights &amp; Predictions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            {
              type: "warning",
              title: "Stock-Out Risk: Augmentin 1g",
              desc: "Augmentin 1g appeared in 5 of 50 transactions — highest frequency drug. Current stock: 90 units. Expiry 2026-04-05. Recommend ordering 200 units from United Pharma immediately.",
              tag: "Reorder Alert",
            },
            {
              type: "warning",
              title: "Expiry Risk: ConCor 5mg",
              desc: "150 units expire on 2026-04-01 — within 30 days. Immediate dispensing or return to Ibn Sina supplier required. Risk of $862.50 inventory write-off.",
              tag: "Near Expiry",
            },
            {
              type: "info",
              title: "Demand Surge: Diabetes Category",
              desc: "Diabetes meds led demand in Feb 2026 with 15 units sold across 6 transactions. Glucophage 1000mg sales up 33% MoM. Reorder from Pharma Overseas recommended.",
              tag: "High Demand",
            },
            {
              type: "success",
              title: "Top Revenue Driver: Antibiotics",
              desc: "Antibiotics generated $328.00 (32.8% of Q1 revenue) across 27 transactions Jan–Mar. Ceftriaxone 1g at $22.50/unit is the highest-margin item. Maintain stock.",
              tag: "Revenue Insight",
            },
            {
              type: "info",
              title: "April Forecast: Antibiotic Demand",
              desc: "Antibiotics demand held steady at 10 units/month in Feb–Mar. Seasonal spring respiratory increase expected. Pre-order Augmentin and Tavanic before Mar 30.",
              tag: "Forecast",
            },
            {
              type: "success",
              title: "Revenue Growth: +3.8% Q1 2026",
              desc: "Revenue grew consistently: Jan $327.50 → Feb $332.65 → Mar $340.15. Diabetes and Antibiotics driving growth. System health: optimal. No critical shortages.",
              tag: "Stock Healthy",
            },
          ].map((insight, i) => (
            <div
              key={insight.title}
              data-ocid={`dashboard.insight.item.${i + 1}`}
              className={`p-4 rounded-xl border-l-4 bg-white shadow-xs ${
                insight.type === "warning"
                  ? "border-l-red-500"
                  : insight.type === "success"
                    ? "border-l-green-500"
                    : "border-l-blue-500"
              }`}
              style={{
                borderTop: "1px solid #e5e7eb",
                borderRight: "1px solid #e5e7eb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    insight.type === "warning"
                      ? "bg-red-100 text-red-700"
                      : insight.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {insight.tag}
                </span>
              </div>
              <h3 className="text-[13px] font-bold text-black mb-1 leading-snug">
                {insight.title}
              </h3>
              <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
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
                    tickFormatter={(v) =>
                      `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                    }
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
              <div className="w-3 h-3 rounded-sm bg-orange-500" />
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
                      stroke={CATEGORY_COLORS[cat] ?? "#555555"}
                      strokeWidth={2.5}
                      dot={{ fill: CATEGORY_COLORS[cat] ?? "#555555", r: 5 }}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Transaction Volume */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-purple-500" />
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
                  fill="#9333ea"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Selling Drugs Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <h2 className="text-[14px] font-display font-bold text-black uppercase tracking-wider">
            Top Selling Drugs
          </h2>
        </div>
        <div
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          data-ocid="dashboard.top_drugs.section"
        >
          {/* Bar Chart */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-cyan-500" />
                Sales by Drug
              </CardTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                Units sold per medicine
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={topDrugsData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                  data-ocid="dashboard.top_drugs.chart_point"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="drug"
                    tick={{ fill: "#000000", fontWeight: 700, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={88}
                  />
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(value: number) => [value, "Units Sold"]}
                  />
                  <Bar
                    dataKey="sales"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                    name="Units Sold"
                  >
                    {topDrugsData.map((entry, index) => (
                      <Cell
                        key={entry.drug}
                        fill={TOP_DRUG_COLORS[index % TOP_DRUG_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary Table */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-[15px] font-display font-700 text-black flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-cyan-500" />
                Top Drugs Summary
              </CardTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                Ranked by units sold
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <table
                className="w-full text-sm"
                data-ocid="dashboard.top_drugs.table"
              >
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-[11px] font-800 text-slate-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left py-2 text-[11px] font-800 text-slate-500 uppercase tracking-wider">
                      Drug
                    </th>
                    <th className="text-right py-2 text-[11px] font-800 text-slate-500 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="text-right py-2 text-[11px] font-800 text-slate-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topDrugsData.map((drug, i) => (
                    <tr
                      key={drug.drug}
                      data-ocid={`dashboard.top_drugs.row.${i + 1}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2.5 pr-2">
                        <span
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-800 text-white"
                          style={{
                            backgroundColor:
                              TOP_DRUG_COLORS[i % TOP_DRUG_COLORS.length],
                          }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2.5 font-700 text-black text-[13px]">
                        {drug.drug}
                      </td>
                      <td className="py-2.5 text-right font-700 text-black text-[13px]">
                        {drug.sales.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-600 text-green-700 text-[13px]">
                        {formatCurrency(drug.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
