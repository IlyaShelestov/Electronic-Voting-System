"use client";

import "./CandidatePopup.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (candidate) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [candidate]);

  if (!candidate) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <div
      className={`popup-overlay ${isVisible ? "visible" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`popup-content ${isVisible ? "visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label={t("close")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="popup-header">
          <div className="header-content">
            <div className="candidate-avatar">
              <img
                src={imgSrc}
                alt={`${candidate.first_name} ${candidate.last_name}`}
                className="candidate-image"
                onError={() => setImgSrc("/images/default-candidate.png")}
              />
              {!candidate.avatar_url && (
                <div className="avatar-fallback">
                  {getInitials(candidate.first_name, candidate.last_name)}
                </div>
              )}
            </div>
            <div className="candidate-basic-info">
              <h2 className="candidate-name">
                {candidate.first_name} {candidate.last_name}
              </h2>
              {candidate.party && (
                <span
                  className={`candidate-party ${
                    !candidate.party ||
                    candidate.party.toLowerCase() === "independent"
                      ? "independent"
                      : ""
                  }`}
                >
                  🏛️ {candidate.party}
                </span>
              )}
            </div>
          </div>
        </div>{" "}
        <div className="popup-body">
          {/* Biography section */}
          {candidate.bio && (
            <div className="info-section">
              <h3
                className="section-title"
                data-icon="📝"
              >
                {t("biography")}
              </h3>
              <div className="info-content">
                <div className="biography-text">{candidate.bio}</div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="info-section">
            <h3
              className="section-title"
              data-icon="📞"
            >
              {t("contactInfo")}
            </h3>
            <div className="info-content">
              <div className="contact-grid">
                {candidate.email ? (
                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                      </svg>
                    </div>
                    <div className="contact-info">
                      <div className="contact-type">{t("email")}</div>
                      <div className="contact-value">
                        <a href={`mailto:${candidate.email}`}>
                          {candidate.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="contact-item empty">
                    <div className="contact-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                      </svg>
                    </div>
                    <div className="contact-info">
                      <div className="contact-type">{t("email")}</div>
                      <div className="contact-value not-available">
                        {t("notProvided")}
                      </div>
                    </div>
                  </div>
                )}

                {candidate.phone_number ? (
                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" />
                      </svg>
                    </div>
                    <div className="contact-info">
                      <div className="contact-type">{t("phone")}</div>
                      <div className="contact-value">
                        <a href={`tel:${candidate.phone_number}`}>
                          {candidate.phone_number}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="contact-item empty">
                    <div className="contact-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" />
                      </svg>
                    </div>
                    <div className="contact-info">
                      <div className="contact-type">{t("phone")}</div>
                      <div className="contact-value not-available">
                        {t("notProvided")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          {(candidate.additional_url_1 || candidate.additional_url_2) && (
            <div className="info-section">
              <h3
                className="section-title"
                data-icon="🔗"
              >
                {t("additionalResources")}
              </h3>
              <div className="info-content">
                <div className="resources-list">
                  {candidate.additional_url_1 && (
                    <div className="resource-item">
                      <div className="resource-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12S4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12S18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12S19.76 7 17 7Z" />
                        </svg>
                      </div>
                      <a
                        href={candidate.additional_url_1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {t("websitePortfolio")}
                      </a>
                    </div>
                  )}
                  {candidate.additional_url_2 && (
                    <div className="resource-item">
                      <div className="resource-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12S4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12S18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12S19.76 7 17 7Z" />
                        </svg>
                      </div>
                      <a
                        href={candidate.additional_url_2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {t("socialMediaProfile")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!candidate.bio && (
            <div className="info-section">
              <div className="empty-section">
                <div className="empty-icon">📝</div>
                <p>{t("noBiographyAvailable")}</p>
              </div>
            </div>
          )}
        </div>{" "}
        <div className="popup-footer">
          <button
            className="close-footer-btn"
            onClick={handleClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
