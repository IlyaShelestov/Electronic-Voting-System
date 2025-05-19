"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslations } from "use-intl";
import { electionService } from "@/services/electionService";
import { IElection } from "@/models/IElection";
import { IReport } from "@/models/IReport";
import { RightArrowCircle } from "@/icons/RightArrowCircle";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

interface Props {
  election: IElection;
  locale: string;
}

export default function ElectionCard({ election, locale }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const router = useRouter();
  const t = useTranslations("home");

  const handleToggle = async () => {
    setExpanded(!expanded);
    if (!chartData && !expanded) {
      const report = await electionService.getReport(election.election_id);
      setChartData(transformReportToChartData(report));
    }
  };

  const navigateToCandidates = () => {
    router.push(`/${locale}/elections/${election.election_id}/candidates`);
  };

  return (
    <div className="election-card">
      <div
        className="election-header"
        onClick={handleToggle}
      >
        <span>{election.title}</span>
        <button
          className={`arrow-btn ${expanded ? "expanded" : ""}`}
          aria-label={t("viewCandidates")}
          onClick={(e) => {
            e.stopPropagation();
            navigateToCandidates();
          }}
        >
          <RightArrowCircle
            color="black"
            strokeWidth={4}
            size={32}
          />
        </button>
      </div>

      {expanded && chartData && (
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
                  time: { unit: "day", tooltipFormat: "dd/MM/yyyy" },
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
      )}
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

const transformReportToChartData = (report: IReport[]) => {
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
};
