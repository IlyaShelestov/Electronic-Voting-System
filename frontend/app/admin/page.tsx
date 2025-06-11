"use client";
import "./Dashboard.scss";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

import {
  ICityDistribution,
  IDashboardStats,
  IRequestStats,
  IRequestsTrendData,
  IUserGrowthData,
  IUserStats,
} from "@/models/IDashboard";
import { AdminService } from "@/services/adminService";
import { chartColors, defaultChartOptions } from "@/utils/chartConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminPage() {
  const t = useTranslations("dashboard");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(
    null
  );
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [requestStats, setRequestStats] = useState<IRequestStats | null>(null);
  const [cityDistribution, setCityDistribution] = useState<ICityDistribution[]>(
    []
  );
  const [userGrowthData, setUserGrowthData] = useState<IUserGrowthData[]>([]);
  const [requestsTrendData, setRequestsTrendData] = useState<
    IRequestsTrendData[]
  >([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7d" | "30d" | "90d" | "1y"
  >("30d");

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, users, requests, cities, userGrowth, requestsTrend] =
        await Promise.all([
          AdminService.fetchDashboardStats(),
          AdminService.fetchUsers(),
          AdminService.fetchRequests(),
          AdminService.fetchCityDistribution(),
          AdminService.fetchUserGrowth(),
          AdminService.fetchRequestsTrend(),
        ]);
      setDashboardStats(stats);

      const processedUserStats: IUserStats = {
        total: users.length,
        byRole: users.reduce((acc, user) => {
          acc[user.role ?? "unknown"] = (acc[user.role ?? "unknown"] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }),
        recentRegistrations: users.filter(
          (user) =>
            new Date(user.created_at || "").getTime() >
            Date.now() - getPeriodMs(selectedPeriod)
        ).length,
        activeUsers: users.length, // All fetched users are considered active
      };
      setUserStats(processedUserStats);

      // Process requests data into request stats
      const processedRequestStats: IRequestStats = {
        total: requests.length,
        byStatus: {
          pending: requests.filter((r) => r.status === "pending").length,
          approved: requests.filter((r) => r.status === "approved").length,
          rejected: requests.filter((r) => r.status === "rejected").length,
        },
        recentRequests: requests.filter(
          (request) =>
            new Date(request.created_at || "").getTime() >
            Date.now() - getPeriodMs(selectedPeriod)
        ).length,
        processingTime: {
          average: 0,
          median: 0, // Would need more complex calculation
        },
      };
      setRequestStats(processedRequestStats);
      setCityDistribution(cities);
      setUserGrowthData(userGrowth);
      setRequestsTrendData(requestsTrend);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getPeriodMs = (period: "7d" | "30d" | "90d" | "1y"): number => {
    const day = 24 * 60 * 60 * 1000;
    switch (period) {
      case "7d":
        return 7 * day;
      case "30d":
        return 30 * day;
      case "90d":
        return 90 * day;
      case "1y":
        return 365 * day;
      default:
        return 30 * day;
    }
  };

  const handleRefresh = () => {
    AdminService.clearCache();
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">
          <div className="spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard__error">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="dashboard__retry-btn"
            aria-label="Retry loading dashboard data"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__controls">
          <select
            value={selectedPeriod}
            onChange={(e) =>
              setSelectedPeriod(e.target.value as "7d" | "30d" | "90d" | "1y")
            }
            className="dashboard__period-selector"
          >
            <option value="7d">{t("period.thisWeek")}</option>
            <option value="30d">{t("period.thisMonth")}</option>
            <option value="90d">{t("period.last3Months")}</option>
            <option value="1y">{t("period.thisYear")}</option>
          </select>
          <button
            onClick={handleRefresh}
            className="dashboard__refresh-btn"
          >
            {t("refresh")}
          </button>
        </div>
      </div>
      <div className="dashboard__stats-grid">
        <StatsCard
          title="Total Users"
          value={dashboardStats?.totalUsers || 0}
          color="blue"
          trend={userStats?.recentRegistrations}
          trendLabel="new this period"
        />
        <StatsCard
          title="Pending Requests"
          value={dashboardStats?.pendingRequests || 0}
          color="orange"
          trend={requestStats?.recentRequests}
          trendLabel="new requests"
        />
        <StatsCard
          title="Approved Requests"
          value={dashboardStats?.approvedRequests || 0}
          color="green"
        />
        <StatsCard
          title="Rejected Requests"
          value={dashboardStats?.rejectedRequests || 0}
          color="red"
        />
      </div>
      {/* Charts Section */}
      <div className="dashboard__charts">
        <div className="dashboard__chart-row">
          <div className="dashboard__chart-container">
            <h3>User Growth</h3>
            <UserGrowthChart data={userGrowthData} />
          </div>
          <div className="dashboard__chart-container">
            <h3>Requests Trend</h3>
            <RequestsTrendChart data={requestsTrendData} />
          </div>
        </div>

        <div className="dashboard__chart-row">
          <div className="dashboard__chart-container">
            <h3>Users by Role</h3>
            <RoleDistributionChart data={dashboardStats?.usersByRole} />
          </div>
          <div className="dashboard__chart-container">
            <h3>City Distribution</h3>
            <CityDistributionChart data={cityDistribution} />
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  color: "blue" | "green" | "orange" | "red";
  trend?: number;
  trendLabel?: string;
}

function StatsCard({ title, value, color, trend, trendLabel }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__content">
        <h4 className="stats-card__title">{title}</h4>
        <p className="stats-card__value">{value.toLocaleString()}</p>
        {trend !== undefined && (
          <p className="stats-card__trend">
            +{trend} {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}

// Chart Components using Chart.js
function UserGrowthChart({ data }: { data: IUserGrowthData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="simple-chart">
        <div className="chart-placeholder">
          <FaChartLine size={48} />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.period),
    datasets: [
      {
        label: "New Users",
        data: data.map((item) => item.newUsers),
        borderColor: chartColors.primary,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Users",
        data: data.map((item) => item.totalUsers),
        borderColor: chartColors.secondary,
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: true,
        text: "User Growth Over Time",
        font: { size: 14, weight: "bold" as const },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}

function RequestsTrendChart({ data }: { data: IRequestsTrendData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="simple-chart">
        <div className="chart-placeholder">
          <FaChartLine size={48} />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.period),
    datasets: [
      {
        label: "New Requests",
        data: data.map((item) => item.newRequests),
        backgroundColor: chartColors.warning,
        borderColor: chartColors.warning,
        borderWidth: 2,
      },
      {
        label: "Approved",
        data: data.map((item) => item.approvedRequests),
        backgroundColor: chartColors.success,
        borderColor: chartColors.success,
        borderWidth: 2,
      },
      {
        label: "Rejected",
        data: data.map((item) => item.rejectedRequests),
        backgroundColor: chartColors.danger,
        borderColor: chartColors.danger,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: true,
        text: "Requests Trend Analysis",
        font: { size: 14, weight: "bold" as const },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
}

function RoleDistributionChart({ data }: { data?: { [key: string]: number } }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="simple-chart">
        <div className="chart-placeholder">
          <FaUsers size={48} />
          <p>No role data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(data).map(
      (role) => role.charAt(0).toUpperCase() + role.slice(1)
    ),
    datasets: [
      {
        label: "Users by Role",
        data: Object.values(data),
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "User Distribution by Role",
        font: { size: 14, weight: "bold" as const },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Doughnut
        data={chartData}
        options={options}
      />
    </div>
  );
}

function CityDistributionChart({ data }: { data: ICityDistribution[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="simple-chart">
        <div className="chart-placeholder">
          <FaChartLine size={48} />
          <p>No city data available</p>
        </div>
      </div>
    );
  }

  const topCities = data.slice(0, 10);

  const chartData = {
    labels: topCities.map((city) => city.cityName || `City ${city.cityId}`),
    datasets: [
      {
        label: "Users by City",
        data: topCities.map((city) => city.userCount),
        backgroundColor: chartColors.palette,
        borderColor: chartColors.palette,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
          generateLabels: function (chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = ((value * 100) / total).toFixed(1);
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: "Top Cities by User Count",
        font: { size: 14, weight: "bold" as const },
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie
        data={chartData}
        options={options}
      />
    </div>
  );
}
