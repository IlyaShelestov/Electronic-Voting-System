"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { electionService } from "@/services/electionService";
import { setElections } from "@/store/slices/electionSlice";
import { IElection } from "@/models/IElection";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "use-intl";
import { RightArrowCircle } from "@/icons/RightArrowCircle";
import { Line } from "react-chartjs-2";
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
import "./Home.scss";
import { IReport } from "@/models/IReport";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend);

export default function Home() {
  const dispatch = useAppDispatch();
  const elections: IElection[] = useAppSelector((state) => state.election.elections);
  const [expandedElection, setExpandedElection] = useState<number | null>(null);
  const [chartData, setChartData] = useState<Record<number, any>>({});
  const locale = useLocale();
  const t = useTranslations("home");
  const router = useRouter();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await electionService.getAll();
        dispatch(setElections(data));
      } catch (error) {
        console.error("Error loading elections", error);
      }
    };

    fetchElections();
  }, [dispatch]);

  const handleElectionToggle = (electionId: number) => {
    if (expandedElection === electionId) {
      setExpandedElection(null);
    } else {
      setExpandedElection(electionId);
      if (!chartData[electionId]) {
        loadChartData(electionId);
      }
    }
  };

  const loadChartData = async (electionId: number) => {
    try {
      const report: IReport[] = await electionService.getReport(electionId);

      const candidates = [...new Set(report.map((item) => item.candidate_id))];

      const datasets = candidates.map((candidateId, index) => {
        const candidateData = report
          .filter((item) => item.candidate_id === candidateId)
          .sort((a, b) => new Date(a.voted_day).getTime() - new Date(b.voted_day).getTime());

        return {
          label: `${candidateData[0]?.party} (ID: ${candidateId})`,
          data: candidateData.map((item) => ({
            x: new Date(item.voted_day),
            y: Number(item.vote_count),
          })),
          borderColor: getCandidateColor(index),
          backgroundColor: getCandidateColor(index),
          tension: 0.4,
          fill: false,
          pointRadius: 4,
        };
      });

      const data = { datasets };

      setChartData((prev) => ({ ...prev, [electionId]: data }));
    } catch (err) {
      console.error(`Failed to load report for election ${electionId}:`, err);
    }
  };

  const navigateToCandidates = (electionId: number) => {
    router.push(`/${locale}/elections/${electionId}/candidates`);
  };

  const candidateColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#8e44ad", "#e67e22"];
  const getCandidateColor = (index: number) => candidateColors[index % candidateColors.length];

  return (
    <div className="home-container">
      <h1 className="home-title">{t("title")}</h1>

      <div className="banner">
        <Image
          src="/images/election-banner.png"
          alt={t("bannerAlt")}
          width={800}
          height={300}
          className="banner-image"
        />
      </div>

      <h2>{t("currentElections")}</h2>

      <div className="elections-list">
        {elections.map((election) => (
          <div key={election.election_id} className="election-card">
            <div
              className="election-header"
              onClick={() => handleElectionToggle(election.election_id)}
            >
              <span>{election.title}</span>
              <button
                className={`arrow-btn ${expandedElection === election.election_id ? "expanded" : ""}`}
                aria-label={t("viewCandidates")}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToCandidates(election.election_id);
                }}
              >
                <RightArrowCircle color="black" strokeWidth={4} size={32} />
              </button>
            </div>

            {expandedElection === election.election_id &&
              chartData[election.election_id] && (
                <div className="election-chart">
                  <Line
                    data={chartData[election.election_id]}
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
        ))}
      </div>
    </div>
  );
}
