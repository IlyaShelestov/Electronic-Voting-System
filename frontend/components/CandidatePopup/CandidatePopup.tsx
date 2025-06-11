"use client";

import "./CandidatePopup.scss";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ICandidate } from "@/models/ICandidate";

interface CandidatePopupProps {
  candidate: ICandidate | null;
  onClose: () => void;
}

export default function CandidatePopup({
  candidate,
  onClose,
}: CandidatePopupProps) {
  const t = useTranslations("candidatePopup");
  const [imgSrc, setImgSrc] = useState(
    candidate?.avatar_url || "/images/default-candidate.png"
  );

  if (!candidate) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="popup-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t("close")}
        >
          ✖
        </button>

        <div className="popup-header">
          <div className="candidate-avatar">
            <img
              src={imgSrc}
              alt={`${candidate.first_name} ${candidate.last_name}`}
              className="candidate-image"
              onError={() => setImgSrc("/images/default-candidate.png")}
            />
          </div>
          <div className="candidate-title">
            <h2 className="candidate-name">
              {candidate.first_name} {candidate.last_name}
            </h2>
            {candidate.party && (
              <p className="candidate-party">{candidate.party}</p>
            )}
          </div>
        </div>

        <div className="popup-body">
          {/* Biography section */}
          {candidate.bio && (
            <div className="info-section">
              <h3>{t("biography")}</h3>
              <div className="bio-content">
                <p>{candidate.bio}</p>
              </div>
            </div>
          )}

          {/* Contact and basic info */}
          <div className="info-section">
            <h3>{t("contactInfo")}</h3>
            <div className="info-grid">
              {candidate.email && (
                <div className="info-item">
                  <strong>{t("email")}:</strong>
                  <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
                </div>
              )}
              {candidate.phone_number && (
                <div className="info-item">
                  <strong>{t("phone")}:</strong>
                  <a href={`tel:${candidate.phone_number}`}>
                    {candidate.phone_number}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Additional resources */}
          {(candidate.additional_url_1 || candidate.additional_url_2) && (
            <div className="info-section">
              <h3>{t("additionalResources")}</h3>
              <div className="links-container">
                {candidate.additional_url_1 && (
                  <a
                    href={candidate.additional_url_1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="link-icon">🔗</span>
                    {t("additionalResource")} 1
                  </a>
                )}
                {candidate.additional_url_2 && (
                  <a
                    href={candidate.additional_url_2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="link-icon">🔗</span>
                    {t("additionalResource")} 2
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Personal details */}
          <div className="info-section">
            <h3>{t("personalDetails")}</h3>
            <div className="info-grid">
              {candidate.date_of_birth && (
                <div className="info-item">
                  <strong>{t("dateOfBirth")}:</strong>
                  <span>
                    {new Date(candidate.date_of_birth).toLocaleDateString()}
                  </span>
                </div>
              )}
              {candidate.city_id && (
                <div className="info-item">
                  <strong>{t("cityId")}:</strong>
                  <span>{candidate.city_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Election info */}
          {candidate.election_id && (
            <div className="info-section">
              <h3>{t("electionInfo")}</h3>
              <div className="info-item">
                <strong>{t("electionId")}:</strong>
                <span>{candidate.election_id}</span>
              </div>
            </div>
          )}
        </div>

        <div className="popup-footer">
          <button
            className="close-footer-btn"
            onClick={onClose}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
