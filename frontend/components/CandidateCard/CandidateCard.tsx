import { ICandidate } from "@/models/ICandidate";
import Image from "next/image";

export default function CandidateCard({ candidate, selectedCandidateId, setSelectedCandidateId, setSelectedCandidate }: { candidate: ICandidate, selectedCandidateId: number, setSelectedCandidateId: (id: number) => void, setSelectedCandidate: (candidate: ICandidate) => void }) {

    return (
        <div
            key={candidate.candidate_id}
            onClick={() => setSelectedCandidateId(candidate.candidate_id)}
        >
                      <h3 className="candidate-name">
                        {candidate.first_name} {candidate.last_name}
                      </h3>
                      <Image
                          src={candidate.avatar_url || "/images/default-candidate.png"}
                          alt={candidate.first_name + " " + candidate.last_name}
                          width={100}
                          height={100}
                          className="candidate-image"
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