"use client";

import './ElectionCard.scss';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import ElectionChart from '@/components/ElectionChart/ElectionChart';
import { RightArrowCircle } from '@/icons/RightArrowCircle';
import { IElection } from '@/models/IElection';
import { IReport } from '@/models/IReport';
import { ElectionService } from '@/services/electionService';

interface Props {
  election: IElection;
}

export default function ElectionCard({ election }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [reportData, setReportData] = useState<IReport[] | null>(null);
  const router = useRouter();
  const t = useTranslations("elections");

  const handleToggle = async () => {
    setExpanded(!expanded);
    if (!reportData && !expanded && election.election_id) {
      const report = await ElectionService.getReport(election.election_id);
      setReportData(report);
    }
  };

  const navigateToCandidates = () => {
    router.push(`/elections/${election.election_id}/candidates`);
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

      {expanded && (
        <div
          className={`election-chart-wrapper ${
            expanded && reportData ? "visible" : ""
          }`}
        >
          {reportData && (
            <div className="election-chart">
              <ElectionChart reportData={reportData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
