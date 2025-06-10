import './CandidateCard.scss';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ICandidate } from '@/models/ICandidate';

interface CandidateCardProps {
    candidate: ICandidate;
    selectedCandidateId: number;
    setSelectedCandidateId: (id: number) => void;
    setSelectedCandidate: (candidate: ICandidate) => void;
    showDetailedInfo?: boolean;
    isSelectable?: boolean;
}

export default function CandidateCard({
    candidate,
    selectedCandidateId,
    setSelectedCandidateId,
    setSelectedCandidate,
    showDetailedInfo = false,
    isSelectable = true,
}: CandidateCardProps) {
    const t = useTranslations("candidateCard");
    const [imgSrc, setImgSrc] = useState(candidate.avatar_url || "/images/default-candidate.png");
    const isSelected = selectedCandidateId === candidate.candidate_id;

    const handleCardClick = () => {
        if (isSelectable) {
            setSelectedCandidateId(candidate.candidate_id ?? 0);
        }
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCandidate(candidate);
    };

    return (
        <div
            className={`candidate-card ${isSelected ? "selected" : ""} ${!isSelectable ? "not-selectable" : ""}`}
            onClick={handleCardClick}
        >
            {/* Selection indicator */}
            {isSelectable && (
                <div className="selection-indicator">
                    <input
                        type="radio"
                        name="candidate-selection"
                        checked={isSelected}
                        onChange={() => setSelectedCandidateId(candidate.candidate_id ?? 0)}
                        className="selection-radio"
                    />
                    <div className="radio-custom"></div>
                </div>
            )}

            {/* Candidate image */}
            <div className="candidate-image-container">
                <img
                    src={imgSrc}
                    alt={`${candidate.first_name} ${candidate.last_name}`}
                    className="candidate-image"
                    onError={() => setImgSrc("/images/default-candidate.png")}
                />
                {isSelected && isSelectable && (
                    <div className="selected-overlay">
                        <span className="checkmark">✓</span>
                    </div>
                )}
            </div>

            {/* Candidate information */}
            <div className="candidate-info">
                <h3 className="candidate-name">
                    {candidate.first_name} {candidate.last_name}
                </h3>

                {candidate.party && (
                    <p className="candidate-party">{candidate.party}</p>
                )}

                {showDetailedInfo && candidate.bio && (
                    <p className="candidate-bio">
                        {candidate.bio.length > 100
                            ? `${candidate.bio.substring(0, 100)}...`
                            : candidate.bio
                        }
                    </p>
                )}

                {/* Additional URLs preview */}
                {showDetailedInfo && (candidate.additional_url_1 || candidate.additional_url_2) && (
                    <div className="candidate-links">
                        {candidate.additional_url_1 && (
                            <a
                                href={candidate.additional_url_1}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="candidate-link"
                            >
                                {t("additionalInfo")} 1
                            </a>
                        )}
                        {candidate.additional_url_2 && (
                            <a
                                href={candidate.additional_url_2}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="candidate-link"
                            >
                                {t("additionalInfo")} 2
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="candidate-actions">
                <button
                    className="candidate-info-btn"
                    onClick={handleInfoClick}
                >
                    {t("viewDetails")}
                </button>

                {isSelectable && !isSelected && (
                    <button
                        className="select-btn"
                        onClick={handleCardClick}
                    >
                        {t("select")}
                    </button>
                )}

                {isSelected && isSelectable && (
                    <span className="selected-indicator">
                        {t("selected")}
                    </span>
                )}
            </div>
        </div>
    );
}