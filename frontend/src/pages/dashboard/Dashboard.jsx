import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaChartLine,
  FaCreditCard,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

import {
  DashboardChart,
  KpiCard,
  LowStock,
  RecentSales,
  ShortExpiry,
} from "../../components/dashboard";
import { getDashboard } from "../../services/dashboardService";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const number = (value = 0) =>
  Number(value || 0).toLocaleString();

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);
      const response = await getDashboard();
      setDashboard(response.data || {});
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const kpis = useMemo(
    () => [
      {
        title: "Today's Sales",
        value: money(dashboard?.totalSalesToday),
        icon: FaChartLine,
        color: "bg-blue-500",
      },
      {
        title: "Today's Payments",
        value: money(dashboard?.totalPaymentsToday),
        icon: FaMoneyBillWave,
        color: "bg-emerald-500",
      },
      {
        title: "Total Credit",
        value: money(dashboard?.totalCredit),
        icon: FaCreditCard,
        color: "bg-orange-500",
      },
      {
        title: "Low / Out Stock",
        value: `${number(dashboard?.lowStock)} / ${number(
          dashboard?.outOfStock
        )}`,
        icon: FaExclamationTriangle,
        color: "bg-red-500",
      },
      {
        title: "Active Products",
        value: number(dashboard?.totalProducts),
        icon: FaBoxOpen,
        color: "bg-violet-500",
      },
      {
        title: "Active Customers",
        value: number(dashboard?.totalCustomers),
        icon: FaUsers,
        color: "bg-slate-700",
      },
    ],
    [dashboard]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            {...kpi}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart
            data={dashboard?.chartData || []}
            loading={loading}
          />
        </div>

        <LowStock
          items={dashboard?.lowStockProducts || []}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales
          sales={dashboard?.recentSales || []}
          loading={loading}
        />

        <ShortExpiry
          items={dashboard?.recentExpiryRecords || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
