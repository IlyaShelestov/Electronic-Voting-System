import { ICandidate } from "@/models/ICandidate";
import "./CandidateCard.scss";
import { useState } from "react";
import Image from "next/image";
export default function CandidateCard(
    { candidate, selectedCandidateId, setSelectedCandidateId, setSelectedCandidate }: 
    { candidate: ICandidate, selectedCandidateId: number, setSelectedCandidateId: (id: number) => void, setSelectedCandidate: (candidate: ICandidate) => void }) {
    const [imgSrc, setImgSrc] = useState(candidate.avatar_url || "/images/default-candidate.png");
    return (
        <div
            key={candidate.candidate_id}
            onClick={() => setSelectedCandidateId(candidate.candidate_id)}
            className={`candidate-card ${selectedCandidateId === candidate.candidate_id ? "selected" : ""}`}
        >
            <h3 className="candidate-name">
            {candidate.first_name} {candidate.last_name}
            </h3>
            <img
                src={imgSrc}
                alt={candidate.first_name + " " + candidate.last_name}
                width={100}
                height={100}
                className="candidate-image"
                onError={() => setImgSrc("/images/default-candidate.png")}
            />
            <button
                className="candidate-info-btn"
                onClick={(e) => {
                e.stopPropagation();
                setSelectedCandidate(candidate);
                }}
            >
            О кандидате
            </button>
        </div>
    )
}