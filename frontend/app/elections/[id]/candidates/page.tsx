"use client";

import './Candidates.scss';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CandidateCard from '@/components/CandidateCard/CandidateCard';
import CandidatePopup from '@/components/CandidatePopup/CandidatePopup';
import { ICandidate } from '@/models/ICandidate';
import { IElection } from '@/models/IElection';
import { ElectionService } from '@/services/electionService';
import { useIsAuthenticated } from '@/store/hooks';
import { formatTimestamp } from '@/utils/formatTimestamp';

export default function CandidatesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [election, setElection] = useState<IElection | null>(null);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const electionData = await ElectionService.getById(Number(id));
        setElection(electionData);    

        const candidatesData = await ElectionService.getCandidates(Number(id));
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching election data:", error);
      }
    };

    if (id) {

      fetchElectionData();
    }
  }, [id]);

  const handleVote = async () => {
    if (!selectedCandidateId) {
      alert("Выберите кандидата перед голосованием!");
      return;
    }
    router.push(`/vote?electionId=${id}&candidateId=${selectedCandidateId}`);
  };

  return (
      <div className="candidates-container">
        {election && (
            <>
              <h1 className="title">{election.title}</h1>
              <p className="date-range">
                {formatTimestamp(election.start_date)} - {formatTimestamp(election.end_date)}
              </p>
              <hr />
              <h2 className="subtitle">Кандидаты</h2>
              <div className="candidates-list">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.candidate_id}
                    candidate={candidate}
                    selectedCandidateId={selectedCandidateId ?? 0}
                    setSelectedCandidateId={setSelectedCandidateId}
                    setSelectedCandidate={setSelectedCandidate}
                  />
                ))}
              </div>
              {isAuthenticated && (
                <button className="vote-button" onClick={handleVote} disabled={!selectedCandidateId}>
                  Проголосовать
                </button>
              )}
            </>
        )}

        {selectedCandidate && (
            <CandidatePopup candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
        )}
      </div>
  );
}
