"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { electionService } from "@/services/electionService";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import Image from "next/image";
import CandidatePopup from "@/components/CandidatePopup/CandidatePopup";
import "./Candidates.scss";
import { formatTimestamp } from "@/utils/formatTimestamp";

export default function CandidatesPage() {
  const { id } = useParams();
  const [election, setElection] = useState<IElection | null>(null);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(
    null
  );

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const electionData = await electionService.getById(Number(id));
        setElection(electionData);

        const candidatesData = await electionService.getCandidates(Number(id));
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching election data:", error);
      }
    };

    if (id) {
      fetchElectionData();
    }
  }, [id]);

  return (
    <div className="candidates-container">
      {election && (
        <>
          <h1 className="title">{election.title}</h1>
          <p className="date-range">
            {formatTimestamp(election.start_date)} -{" "}
            {formatTimestamp(election.end_date)}
          </p>
          <hr />
          <h2 className="subtitle">Кандидаты</h2>
          <div className="candidates-list">
            {candidates.map((candidate) => (
              <div
                key={candidate.candidate_id}
                className="candidate-card"
              >
                <h3 className="candidate-name">
                  {candidate.first_name + " " + candidate.last_name}
                </h3>
                <Image
                  src={candidate.image_url || "/images/default-candidate.jpg"}
                  alt={candidate.first_name + " " + candidate.last_name}
                  width={100}
                  height={100}
                  className="candidate-image"
                />

                <button
                  className="candidate-info-btn"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  О кандидате
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCandidate && (
        <CandidatePopup
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
