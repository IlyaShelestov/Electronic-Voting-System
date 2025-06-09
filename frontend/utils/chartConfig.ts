// Chart.js configuration and registration
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

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
  ArcElement,
  Filler
);

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          family: "Inter, sans-serif",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#333",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
          family: "Inter, sans-serif",
        },
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "rgba(107, 114, 128, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
          family: "Inter, sans-serif",
        },
        color: "#6b7280",
      },
    },
  },
};

export const chartColors = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  gradient: {
    blue: "linear-gradient(180deg, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.1) 100%)",
    purple:
      "linear-gradient(180deg, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.1) 100%)",
    green:
      "linear-gradient(180deg, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.1) 100%)",
  },
  palette: [
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ],
};

export default ChartJS;
