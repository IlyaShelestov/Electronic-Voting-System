"use client";

import "./ElectionCard.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { electionService } from "@/services/electionService";
import { IElection } from "@/models/IElection";
import { IReport } from "@/models/IReport";
import { RightArrowCircle } from "@/icons/RightArrowCircle";
import ElectionChart from "@/components/ElectionChart/ElectionChart";

interface Props {
  election: IElection;
  locale: string;
}

export default function ElectionCard({ election, locale }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [reportData, setReportData] = useState<IReport[] | null>(null);
  const router = useRouter();
  const t = useTranslations("home");

  const handleToggle = async () => {
    setExpanded(!expanded);
    if (!reportData && !expanded) {
      const report = await electionService.getReport(election.election_id);
      setReportData(report);
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

      {expanded && reportData && <ElectionChart reportData={reportData} />}
    </div>
  );
}
