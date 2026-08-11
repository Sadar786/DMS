import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowTrendUp,
  FaBoxesStacked,
  FaCartShopping,
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
  FaTriangleExclamation,
  FaWallet,
} from "react-icons/fa6";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
} from "../../ui";
import { getBusinessAnalytics } from "../../services/reportService";

const presets = [
  { label: "Daily", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Custom", value: "custom" },
];

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const number = (value = 0) =>
  Number(value || 0).toLocaleString();

const dateOnly = (date) =>
  new Date(date).toISOString().slice(0, 10);

const getMonthValue = (date) => dateOnly(date).slice(0, 7);

const getWeekValue = (date) => {
  const target = new Date(date);
  const dayNumber = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((target - firstThursday) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7
    );

  return `${target.getFullYear()}-W${String(week).padStart(
    2,
    "0"
  )}`;
};

const getWeekRange = (weekValue) => {
  const [year, week] = weekValue
    .split("-W")
    .map((value) => Number(value));
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset =
    (week - 1) * 7 -
    ((firstDayOfYear.getDay() + 6) % 7);
  const monday = new Date(year, 0, 1 + daysOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: dateOnly(monday),
    to: dateOnly(sunday),
  };
};

const getMonthRange = (monthValue) => {
  const [year, month] = monthValue
    .split("-")
    .map((value) => Number(value));
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    from: dateOnly(start),
    to: dateOnly(end),
  };
};

const getYearRange = (yearValue) => ({
  from: `${yearValue}-01-01`,
  to: `${yearValue}-12-31`,
});

function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  color = "bg-primary-600",
  loading = false,
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {loading ? "..." : value}
          </h3>
          {helper && (
            <p className="mt-1 text-xs text-slate-400">
              {helper}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${color}`}
        >
          <Icon size={20} />
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsChart({ data = [], loading = false }) {
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(
        item.sales || 0,
        item.stockInValue || 0,
        item.lossValue || 0
      )
    ),
    1
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Sales, Stock In & Loss Trend</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Green = sales, Blue = stock in, Red = loss
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex h-72 items-center justify-center text-slate-400">
            Loading analytics...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-slate-400">
            No data for selected range.
          </div>
        ) : (
          <div className="flex h-72 items-end gap-3 overflow-x-auto pb-2">
            {data.map((item) => {
              const salesHeight = Math.max(
                ((item.sales || 0) / maxValue) * 100,
                item.sales ? 4 : 1
              );
              const stockHeight = Math.max(
                ((item.stockInValue || 0) / maxValue) * 100,
                item.stockInValue ? 4 : 1
              );
              const lossHeight = Math.max(
                ((item.lossValue || 0) / maxValue) * 100,
                item.lossValue ? 4 : 1
              );

              return (
                <div
                  key={item.period}
                  className="flex min-w-20 flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-52 w-full items-end justify-center gap-1 rounded-lg bg-slate-100 px-2">
                    <div
                      className="w-3 rounded-t bg-emerald-500"
                      style={{ height: `${salesHeight}%` }}
                      title={`Sales: ${money(item.sales)}`}
                    />
                    <div
                      className="w-3 rounded-t bg-blue-500"
                      style={{ height: `${stockHeight}%` }}
                      title={`Stock In: ${money(
                        item.stockInValue
                      )}`}
                    />
                    <div
                      className="w-3 rounded-t bg-red-500"
                      style={{ height: `${lossHeight}%` }}
                      title={`Loss: ${money(item.lossValue)}`}
                    />
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    {item.period}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Reports() {
  const [preset, setPreset] = useState("today");
  const [selectedDay, setSelectedDay] = useState(
    dateOnly(new Date())
  );
  const [selectedWeek, setSelectedWeek] = useState(
    getWeekValue(new Date())
  );
  const [selectedMonth, setSelectedMonth] = useState(
    getMonthValue(new Date())
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [customFrom, setCustomFrom] = useState(
    dateOnly(new Date())
  );
  const [customTo, setCustomTo] = useState(dateOnly(new Date()));
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  function getSelectedRange() {
    if (preset === "today") {
      return {
        from: selectedDay,
        to: selectedDay,
      };
    }

    if (preset === "weekly") {
      return getWeekRange(selectedWeek);
    }

    if (preset === "monthly") {
      return getMonthRange(selectedMonth);
    }

    if (preset === "yearly") {
      return getYearRange(selectedYear);
    }

    return {
      from: customFrom,
      to: customTo,
    };
  }

  async function loadAnalytics() {
    try {
      setLoading(true);
      const range = getSelectedRange();

      const params = new URLSearchParams({
        preset,
        from: range.from,
        to: range.to,
      });

      const response = await getBusinessAnalytics(
        `?${params.toString()}`
      );

      setAnalytics(response.data || {});
    } catch (error) {
      toast.error(error.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const summary = analytics?.summary || {};
  const selectedRange = getSelectedRange();

  const stats = useMemo(
    () => [
      {
        title: "Sales",
        value: money(summary.totalSales),
        helper: `${number(summary.totalInvoices)} invoices`,
        icon: FaCartShopping,
        color: "bg-emerald-600",
      },
      {
        title: "Stock In",
        value: money(summary.totalStockInValue),
        helper: `${number(summary.totalStockIn)} units`,
        icon: FaBoxesStacked,
        color: "bg-blue-600",
      },
      {
        title: "Gross Profit",
        value: money(summary.grossProfit),
        helper: `COGS ${money(summary.costOfGoodsSold)}`,
        icon: FaArrowTrendUp,
        color: "bg-violet-600",
      },
      {
        title: "Loss",
        value: money(summary.totalLossValue),
        helper: `${number(summary.totalLossQuantity)} expired/degas`,
        icon: FaTriangleExclamation,
        color: "bg-red-600",
      },
      {
        title: "Net Profit",
        value: money(summary.netProfit),
        helper:
          summary.netProfit < 0
            ? "Loss after expiry/degas"
            : "After expiry/degas loss",
        icon: FaChartLine,
        color:
          summary.netProfit < 0 ? "bg-red-600" : "bg-primary-600",
      },
      {
        title: "Payments",
        value: money(summary.totalPaymentsAmount),
        helper: `${number(summary.totalPayments)} receipts`,
        icon: FaMoneyBillWave,
        color: "bg-teal-600",
      },
      {
        title: "Credit / Receivable",
        value: money(summary.totalCredit),
        helper: "Unpaid balance in selected sales",
        icon: FaWallet,
        color: "bg-orange-600",
      },
      {
        title: "Average Invoice",
        value: money(summary.averageInvoiceValue),
        helper: `${number(summary.itemsSold)} items sold`,
        icon: FaReceipt,
        color: "bg-slate-700",
      },
    ],
    [summary]
  );

  const topProductColumns = [
    {
      key: "name",
      title: "Product",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.sku}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      title: "Qty",
      render: (row) => number(row.quantity),
    },
    {
      key: "total",
      title: "Sales",
      render: (row) => money(row.total),
    },
  ];

  const recentSaleColumns = [
    {
      key: "invoiceNumber",
      title: "Invoice",
    },
    {
      key: "customer",
      title: "Customer",
      render: (row) =>
        row.customer?.shopName ||
        row.customer?.name ||
        "Walk-in Customer",
    },
    {
      key: "saleDate",
      title: "Date",
      render: (row) => dateOnly(row.saleDate),
    },
    {
      key: "grandTotal",
      title: "Total",
      render: (row) => money(row.grandTotal),
    },
    {
      key: "paymentStatus",
      title: "Status",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Reports & Analytics</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              View daily, weekly, monthly, yearly, or custom range
              performance.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Period
              </label>
              <select
                value={preset}
                onChange={(event) =>
                  setPreset(event.target.value)
                }
                className="h-10 w-full rounded-control border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              >
                {presets.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {preset === "today" && (
              <Input
                type="date"
                label="Select Day"
                value={selectedDay}
                onChange={(event) =>
                  setSelectedDay(event.target.value)
                }
              />
            )}

            {preset === "weekly" && (
              <Input
                type="week"
                label="Select Week"
                value={selectedWeek}
                onChange={(event) =>
                  setSelectedWeek(event.target.value)
                }
              />
            )}

            {preset === "monthly" && (
              <Input
                type="month"
                label="Select Month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(event.target.value)
                }
              />
            )}

            {preset === "yearly" && (
              <Input
                type="number"
                label="Select Year"
                min="2000"
                max="2100"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(event.target.value)
                }
              />
            )}

            {preset === "custom" && (
              <>
                <Input
                  type="date"
                  label="From"
                  value={customFrom}
                  onChange={(event) =>
                    setCustomFrom(event.target.value)
                  }
                />

                <Input
                  type="date"
                  label="To"
                  value={customTo}
                  onChange={(event) =>
                    setCustomTo(event.target.value)
                  }
                />
              </>
            )}

            <div className="flex items-end md:col-span-2">
              <Button
                onClick={loadAnalytics}
                loading={loading}
                className="w-full md:w-auto"
              >
                Apply Report
              </Button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Selected range: {selectedRange.from} to{" "}
            {selectedRange.to}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            loading={loading}
          />
        ))}
      </div>

      <AnalyticsChart
        data={analytics?.series || []}
        loading={loading}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={topProductColumns}
              data={(analytics?.topProducts || []).map((item) => ({
                ...item,
                _id: item.productId || item.name,
              }))}
              loading={loading}
              emptyMessage="No top products in this period."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentSaleColumns}
              data={analytics?.recentSales || []}
              loading={loading}
              emptyMessage="No sales in this period."
            />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-slate-400">
        Profit is estimated from current product cost price because
        historical cost is not stored on sale items yet.
      </p>
    </div>
  );
}
