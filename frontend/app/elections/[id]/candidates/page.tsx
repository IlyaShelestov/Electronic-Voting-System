"use client";

import "./Candidates.scss";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CandidateCard from "@/components/CandidateCard/CandidateCard";
import CandidatePopup from "@/components/CandidatePopup/CandidatePopup";
import { ICandidate } from "@/models/ICandidate";
import { IElection } from "@/models/IElection";
import { ElectionService } from "@/services/electionService";
import { VoteService } from "@/services/voteService";
import { useIsAuthenticated } from "@/store/hooks";
import { formatTimestamp } from "@/utils/formatTimestamp";

export default function CandidatesPage() {
  const t = useTranslations("candidatesPage");
  const { id } = useParams();
  const router = useRouter();
  const [election, setElection] = useState<IElection | null>(null);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(
    null
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [canVoteLocation, setCanVoteLocation] = useState(false);
  const [isElectionActive, setIsElectionActive] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    const fetchElectionData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const electionData = await ElectionService.getById(Number(id));
        setElection(electionData);

        // Check if election is currently active
        const now = new Date();
        const startDate = new Date(electionData.start_date);
        const endDate = new Date(electionData.end_date);
        setIsElectionActive(now >= startDate && now <= endDate);

        const candidatesData = await ElectionService.getCandidates(Number(id));
        setCandidates(candidatesData);

        // Check voting status and location eligibility for authenticated users
        if (isAuthenticated) {
          try {
            const [votingStatus, locationCheck] = await Promise.all([
              VoteService.checkVotedStatus(Number(id)),
              VoteService.checkVoteLocation(Number(id)),
            ]);
            setHasVoted(votingStatus.hasVoted);
            setCanVoteLocation(!!locationCheck);
          } catch (error) {
            console.error("Error checking voting eligibility:", error);
            setCanVoteLocation(false);
          }
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
        toast.error(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [id, isAuthenticated, t]);

  const handleCandidateSelect = (
    candidateId: number,
    candidate: ICandidate
  ) => {
    setSelectedCandidateId(candidateId);
    // Also store the full candidate object for easy access
    const selectedCand = candidates.find((c) => c.candidate_id === candidateId);
    if (selectedCand) {
      setSelectedCandidate(selectedCand);
    }
  };

  const handleViewCandidateInfo = (candidate: ICandidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseCandidatePopup = () => {
    setSelectedCandidate(null);
  };

  const getVoteButtonText = () => {
    if (!isAuthenticated) return t("loginToVote");
    if (hasVoted) return t("alreadyVoted");
    if (!isElectionActive) return t("electionNotActive");
    if (!canVoteLocation) return t("notEligibleLocation");
    if (!selectedCandidateId) return t("selectCandidate");
    return t("vote");
  };

  const getVoteButtonDisabled = () => {
    return (
      !isAuthenticated ||
      hasVoted ||
      !isElectionActive ||
      !canVoteLocation ||
      !selectedCandidateId
    );
  };

  const handleVote = async () => {
    if (!selectedCandidateId) {
      toast.warn(t("selectCandidateWarning"));
      return;
    }

    if (!isAuthenticated) {
      toast.warn(t("loginRequiredWarning"));
      router.push("/auth/login");
      return;
    }

    if (hasVoted) {
      toast.info(t("alreadyVotedInfo"));
      return;
    }

    if (!isElectionActive) {
      toast.warn(t("electionNotActiveWarning"));
      return;
    }

    if (!canVoteLocation) {
      toast.warn(t("locationNotEligibleWarning"));
      return;
    }

    // Redirect to vote page with election and candidate info
    router.push(`/vote?electionId=${id}&candidateId=${selectedCandidateId}`);
  };
  if (loading) {
    return (
      <div className="candidates-container">
        <div className="container-inner">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="message">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="candidates-container">
        <div className="container-inner">
          <div className="error-container">
            <div className="icon">🗳️</div>
            <h2 className="message">{t("electionNotFound")}</h2>
            <p>{t("electionNotFoundDescription")}</p>
            <button
              className="return-button"
              onClick={() => router.push("/elections")}
            >
              ← {t("backToElections")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidates-container">
      <div className="container-inner">
        <div className="election-header">
          <div className="header-content">
            <h1 className="title">{election.title}</h1>
            <div className="date-range">
              📅 {formatTimestamp(election.start_date)} -{" "}
              {formatTimestamp(election.end_date)}
            </div>

            <div className="election-status">
              <span
                className={`status-badge ${
                  isElectionActive ? "active" : "inactive"
                }`}
              >
                {isElectionActive ? `🟢 ${t("active")}` : `🔴 ${t("inactive")}`}
              </span>
              {isAuthenticated && hasVoted && (
                <span className="status-badge voted">
                  ✅ {t("youHaveVoted")}
                </span>
              )}
              {isAuthenticated && !canVoteLocation && (
                <span className="status-badge ineligible">
                  📍 {t("locationIneligible")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="candidates-section">
          <div className="section-header">
            <h2 className="subtitle">{t("candidates")}</h2>
            <div className="candidates-count">
              👥 {candidates.length} {t("totalCandidates")}
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="no-candidates">
              <div className="icon">👥</div>
              <p className="message">{t("noCandidatesFound")}</p>
              <p className="description">
                Check back later as candidates may be added before the election
                begins.
              </p>
            </div>
          ) : (
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.candidate_id}
                  candidate={candidate}
                  selectedCandidateId={selectedCandidateId ?? 0}
                  setSelectedCandidateId={(id) =>
                    handleCandidateSelect(id, candidate)
                  }
                  setSelectedCandidate={handleViewCandidateInfo}
                  showDetailedInfo={true}
                  isSelectable={
                    isAuthenticated &&
                    !hasVoted &&
                    isElectionActive &&
                    canVoteLocation
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Vote section */}
        {isAuthenticated && candidates.length > 0 && (
          <div className="vote-section">
            {selectedCandidateId && (
              <div className="selected-candidate-info">
                <h3>{t("selectedCandidate")}</h3>
                <div className="candidate-summary">
                  {candidates
                    .filter((c) => c.candidate_id === selectedCandidateId)
                    .map((candidate) => (
                      <div
                        key={candidate.candidate_id}
                        className="candidate-summary-card"
                      >
                        {candidate.avatar_url && (
                          <img
                            src={candidate.avatar_url}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                            className="candidate-avatar-small"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/default-candidate.png";
                            }}
                          />
                        )}
                        <div className="candidate-details">
                          <h4>
                            {candidate.first_name} {candidate.last_name}
                          </h4>
                          {candidate.party && (
                            <div className="party">🏛️ {candidate.party}</div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <button
              className={`vote-button ${
                getVoteButtonDisabled() ? "disabled" : "enabled"
              }`}
              onClick={handleVote}
              disabled={getVoteButtonDisabled()}
            >
              {getVoteButtonText()}
            </button>

            {/* Voting eligibility messages */}
            <div className="voting-info">
              {!isAuthenticated && (
                <div className="info-message">
                  {t("loginToSeeVotingOptions")}
                </div>
              )}
              {isAuthenticated && !isElectionActive && (
                <div className="warning-message">
                  {t("electionNotActiveMessage")}
                </div>
              )}
              {isAuthenticated && !canVoteLocation && (
                <div className="warning-message">
                  {t("locationNotEligibleMessage")}
                </div>
              )}
              {isAuthenticated && hasVoted && (
                <div className="success-message">
                  {t("voteAlreadyCastMessage")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to elections button */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button
            className="return-button"
            onClick={() => router.push("/")}
          >
            ← {t("backToHome")}
          </button>
        </div>
      </div>

      {/* Candidate detail popup */}
      {selectedCandidate && (
        <CandidatePopup
          candidate={selectedCandidate}
          onClose={handleCloseCandidatePopup}
        />
      )}
    </div>
  );
}
