"use client";

import dynamic from "next/dynamic";
import { IReport } from "@/models/IReport";
import { useTranslations } from "use-intl";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

interface ElectionChartProps {
  reportData: IReport[];
}

export default function ElectionChart({ reportData }: ElectionChartProps) {
  const t = useTranslations("home");
  const chartData = transformReportToChartData(reportData);

  return (
    <div className="election-chart">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "dd/MM/yyyy",
              },
              title: { display: true, text: t("date") },
              ticks: { autoSkip: true, maxTicksLimit: 10 },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: t("votes") },
            },
          },
        }}
      />
    </div>
  );
}

const candidateColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#8e44ad",
  "#e67e22",
];

function transformReportToChartData(report: IReport[]) {
  const candidates = [...new Set(report.map((item) => item.candidate_id))];

  const datasets = candidates.map((candidateId, index) => {
    const candidateData = report
      .filter((item) => item.candidate_id === candidateId)
      .sort(
        (a, b) =>
          new Date(a.voted_day).getTime() - new Date(b.voted_day).getTime()
      );

    return {
      label: `${candidateData[0]?.party} (ID: ${candidateId})`,
      data: candidateData.map((item) => ({
        x: new Date(item.voted_day),
        y: Number(item.vote_count),
      })),
      borderColor: candidateColors[index % candidateColors.length],
      backgroundColor: candidateColors[index % candidateColors.length],
      tension: 0.4,
      fill: false,
      pointRadius: 4,
    };
  });

  return { datasets };
}
