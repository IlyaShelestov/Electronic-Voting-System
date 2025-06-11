"use client";

import "./Vote.scss";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import OtpModal from "@/components/OtpModal/OtpModal";
import TokenVerification from "@/components/TokenVerification/TokenVerification";
import { ICandidate } from "@/models/ICandidate";
import { IElection } from "@/models/IElection";
import { ElectionService } from "@/services/electionService";
import { OtpService } from "@/services/otpService";
import { VoteService } from "@/services/voteService";
import { useEmail } from "@/store/hooks";

export default function VotePage() {
  const t = useTranslations("votePage");
  const searchParams = useSearchParams();
  const queryElectionId = searchParams.get("electionId");
  const queryCandidateId = searchParams.get("candidateId");

  const [elections, setElections] = useState<IElection[]>([]);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isTokenVerificationOpen, setIsTokenVerificationOpen] = useState(false);
  const [voteToken, setVoteToken] = useState<string | null>(null);
  const email = useEmail();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await ElectionService.getAvailable();
        setElections(data);
      } catch (error) {
        toast.error("Ошибка загрузки выборов.");
        console.error("Error fetching elections:", error);
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (selectedElection) {
        try {
          setLoading(true);
          const data = await ElectionService.getCandidates(selectedElection);
          setCandidates(data);

          if (queryCandidateId) {
            const candidateExists = data.some(
              (candidate: ICandidate) =>
                candidate.candidate_id === Number(queryCandidateId)
            );
            if (candidateExists) {
              setSelectedCandidate(Number(queryCandidateId));
            }
          }
        } catch (error) {
          toast.error("Ошибка загрузки кандидатов.");
          console.error("Error fetching candidates:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCandidates([]);
        setSelectedCandidate(null);
      }
    };

    fetchCandidates();
  }, [selectedElection]);

  useEffect(() => {
    if (queryElectionId) {
      setSelectedElection(Number(queryElectionId));
    }
  }, [queryElectionId]);

  useEffect(() => {
    const checkVotingStatus = async () => {
      if (selectedElection) {
        try {
          const status = await VoteService.checkVotedStatus(selectedElection);
          setHasVoted(status.hasVoted);
        } catch (error) {
          console.error("Error checking voting status:", error);
        }
      }
    };

    checkVotingStatus();
  }, [selectedElection]);

  const handleElectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const electionId = e.target.value ? Number(e.target.value) : null;
    setSelectedElection(electionId);
    setSelectedCandidate(null);
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.warn("Выберите кандидата перед голосованием!");
      return;
    }
    try {
      await OtpService.sendOtp(email);
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("Ошибка при отправке OTP:", error);
      toast.error("Не удалось отправить OTP. Попробуйте снова.");
    }
  };
  const handleOtpSubmit = async (otp: string) => {
    if (selectedCandidate !== null) {
      try {
        const result = await VoteService.castVote(
          Number(selectedElection),
          selectedCandidate,
          otp
        );
        
        setIsOtpModalOpen(false);
        setHasVoted(true);
        
        // Store the vote token for display
        if (result.token) {
          setVoteToken(result.token);
        }
        
        toast.success("Ваш голос успешно принят!");
      } catch (error) {
        console.error("Ошибка голосования:", error);
        toast.error("Ошибка голосования. Пожалуйста, попробуйте еще раз.");
      }
    } else {
      toast.warn("Выберите кандидата перед голосованием!");
    }
  };
  return (
    <div className="vote-page">      <div className="vote-header">
        <h1 className="vote-title">{t("title")}</h1>
        <p className="vote-subtitle">{t("subtitle")}</p>
        <div className="header-actions">
          <button
            onClick={() => setIsTokenVerificationOpen(true)}
            className="verify-token-header-btn"
          >
            🔍 {t("verifyToken")}
          </button>
        </div>
      </div>

      <div className="vote-container">
        <div className="vote-card">
          <div className="election-selection">
            <div className="selection-header">
              <h2>{t("selectElection")}</h2>
              <span className="selection-icon">🗳️</span>
            </div>
            <div className="select-wrapper">
              <select
                id="election-select"
                value={selectedElection ?? ""}
                onChange={handleElectionChange}
                className="election-select"
              >
                <option value="">{t("chooseElection")}</option>
                {elections.map((election) => (
                  <option
                    key={election.election_id}
                    value={election.election_id}
                  >
                    {election.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedElection && (
            <div className="candidates-section">
              <div className="candidates-header">
                <h3>{t("selectCandidate")}</h3>
                <span className="candidates-count">
                  {candidates.length} {t("candidates")}
                </span>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>{t("loadingCandidates")}</p>
                </div>
              ) : !hasVoted ? (
                <div className="candidate-grid">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.candidate_id}
                      className={`candidate-card ${
                        selectedCandidate === candidate.candidate_id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCandidate(candidate.candidate_id ?? null)
                      }
                    >
                      <div className="candidate-avatar">
                        {candidate.avatar_url ? (
                          <img
                            src={candidate.avatar_url}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {candidate.first_name?.charAt(0)}
                            {candidate.last_name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="candidate-info">
                        <h4 className="candidate-name">
                          {candidate.first_name} {candidate.last_name}
                        </h4>{" "}
                        {candidate.party && (
                          <p className="candidate-party">{candidate.party}</p>
                        )}
                      </div>
                      <div className="candidate-radio">
                        <input
                          type="radio"
                          name="candidate"
                          value={candidate.candidate_id}
                          checked={selectedCandidate === candidate.candidate_id}
                          onChange={() =>
                            setSelectedCandidate(candidate.candidate_id ?? null)
                          }
                        />
                        <div className="radio-custom"></div>
                      </div>
                    </div>
                  ))}
                </div>              ) : (
                <div className="already-voted">
                  <div className="voted-icon">✅</div>
                  <h3>{t("alreadyVoted")}</h3>
                  <p>{t("voteRecorded")}</p>
                  
                  {voteToken && (
                    <div className="vote-token-display">
                      <h4>Your Vote Token:</h4>
                      <div className="token-container">
                        <code className="token-code">{voteToken}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(voteToken)}
                          className="copy-token-btn"
                          title="Copy token"
                        >
                          📋
                        </button>
                      </div>
                      <p className="token-note">
                        Save this token to verify your vote later
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsTokenVerificationOpen(true)}
                    className="verify-token-btn"
                  >
                    {t("verifyToken")}
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedElection && !hasVoted && (
            <div className="vote-actions">
              <button
                onClick={handleVote}
                className={`vote-button ${
                  selectedCandidate ? "enabled" : "disabled"
                }`}
                disabled={!selectedCandidate}
              >
                <span className="button-icon">🗳️</span>
                {t("vote")}
              </button>
              {selectedCandidate && (
                <p className="vote-confirmation">
                  {t("confirmVote")}{" "}
                  {
                    candidates.find((c) => c.candidate_id === selectedCandidate)
                      ?.first_name
                  }{" "}
                  {
                    candidates.find((c) => c.candidate_id === selectedCandidate)
                      ?.last_name
                  }
                </p>
              )}
            </div>
          )}
        </div>
      </div>      <OtpModal
        email={email}
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmit={handleOtpSubmit}
      />
      
      <TokenVerification
        isOpen={isTokenVerificationOpen}
        onClose={() => setIsTokenVerificationOpen(false)}
      />
    </div>
  );
}
