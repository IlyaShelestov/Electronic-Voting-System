"use client";

import { ICandidate } from "@/models/ICandidate";
import Image from "next/image";
import "./CandidatePopup.scss";

interface CandidatePopupProps {
  candidate: ICandidate | null;
  onClose: () => void;
}

export default function CandidatePopup({
  candidate,
  onClose,
}: CandidatePopupProps) {
  if (!candidate) return null;

  return (
    <div
      className="popup-overlay"
      onClick={onClose}
    >
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="popup-header">
          <Image
            src={"/images/default-candidate.png"}
            alt={candidate.first_name + " " + candidate.last_name}
            width={150}
            height={150}
            className="candidate-image"
          />
          <h2>{candidate.first_name + " " + candidate.last_name}</h2>
        </div>
        <div className="popup-body">
          <h3>О кандидате</h3>
          <hr />
          <p>{candidate.bio}</p>
          <div className="media-gallery"></div>
        </div>
      </div>
    </div>
  );
}
