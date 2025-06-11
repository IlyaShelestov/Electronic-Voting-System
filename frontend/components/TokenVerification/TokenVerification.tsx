"use client";

import "./TokenVerification.scss";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

import { VoteService } from "@/services/voteService";

interface TokenVerificationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VoteDetails {
  vote_id: number;
  election_id: number;
  candidate_id: number;
  token: string;
  voted_at: string;
  candidate_name?: string;
  election_title?: string;
}

export default function TokenVerification({ isOpen, onClose }: TokenVerificationProps) {
  const t = useTranslations("votePage");
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [voteDetails, setVoteDetails] = useState<VoteDetails | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");

  const handleVerify = async () => {
    if (!token.trim()) {
      toast.warn(t("tokenRequired"));
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("idle");

    try {
      const result = await VoteService.checkVoteToken(token.trim());
      setVoteDetails(result);
      setVerificationStatus("success");
      toast.success(t("verificationSuccess"));
    } catch (error: any) {
      console.error("Token verification error:", error);
      setVerificationStatus("error");
      
      if (error.response?.status === 404) {
        toast.error(t("tokenNotFound"));
      } else {
        toast.error(t("verificationError"));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setToken("");
    setVoteDetails(null);
    setVerificationStatus("idle");
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="token-verification-overlay">
      <div className="token-verification-modal">
        <div className="token-verification-header">
          <h2>{t("tokenVerification")}</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="token-verification-content">
          <div className="token-input-section">
            <label htmlFor="token-input">{t("enterToken")}</label>
            <input
              id="token-input"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("tokenPlaceholder")}
              className="token-input"
              disabled={isVerifying}
            />
            <button
              onClick={handleVerify}
              disabled={!token.trim() || isVerifying}
              className="verify-button"
            >
              {isVerifying ? (
                <span className="loading-spinner"></span>
              ) : (
                t("verifyVote")
              )}
            </button>
          </div>

          {verificationStatus === "success" && voteDetails && (
            <div className="verification-result success">
              <div className="status-icon">✅</div>
              <h3>{t("tokenValid")}</h3>
              <div className="vote-details">
                <h4>{t("voteDetails")}</h4>
                <div className="detail-item">
                  <span className="label">Vote ID:</span>
                  <span className="value">{voteDetails.vote_id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Election ID:</span>
                  <span className="value">{voteDetails.election_id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Candidate ID:</span>
                  <span className="value">{voteDetails.candidate_id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Voted At:</span>
                  <span className="value">{formatDate(voteDetails.voted_at)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Token:</span>
                  <span className="value token-display">{voteDetails.token}</span>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="verification-result error">
              <div className="status-icon">❌</div>
              <h3>{t("tokenInvalid")}</h3>
            </div>
          )}
        </div>

        <div className="token-verification-footer">
          <button onClick={handleClose} className="close-footer-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
