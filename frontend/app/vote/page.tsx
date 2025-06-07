"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ElectionService } from "@/services/electionService";
import { VoteService } from "@/services/voteService";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import "./Vote.scss";
import OtpModal from '@/components/OtpModal/OtpModal';
import { useTranslations } from "next-intl";

export default function VotePage() {
    const t = useTranslations("votePage");
    const searchParams = useSearchParams();
    const queryElectionId = searchParams.get("electionId");
    const queryCandidateId = searchParams.get("candidateId");

    const [elections, setElections] = useState<IElection[]>([]);
    const [selectedElection, setSelectedElection] = useState<number | null>(null);
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await ElectionService.getAll();
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
                            (candidate: ICandidate) => candidate.candidate_id === Number(queryCandidateId)
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
                    console.error('Error checking voting status:', error);
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
        setIsOtpModalOpen(true);
    };

    const handleOtpSubmit = async (otp: string) => {
        if (selectedCandidate !== null) {
            try {
                await VoteService.castVote(Number(selectedElection), selectedCandidate, otp);
                setIsOtpModalOpen(false);
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
        <>
            <h1 className="vote-title">{t("title")}</h1>

        <div className="vote-container">
            <div className="vote-box">
                <label htmlFor="election-select">{t("selectElection")}</label>
                <select
                    id="election-select"
                    value={selectedElection ?? ""}
                    onChange={handleElectionChange}
                >
                    <option value="">{t("selectElection")}</option>
                    {elections.map((election) => (
                        <option key={election.election_id} value={election.election_id}>
                            {election.title}
                        </option>
                    ))}
                </select>

                {loading ? (
                    <p>{t("loadingCandidates")}</p>
                ) : !hasVoted ? (
                    <ul className="candidate-list">
                        {candidates.map((candidate) => (
                            <li key={candidate.candidate_id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="candidate"
                                        value={candidate.candidate_id}
                                        checked={selectedCandidate === candidate.candidate_id}
                                        onChange={() => setSelectedCandidate(candidate.candidate_id ?? null)}
                                    />
                                    {candidate.first_name + " " + candidate.last_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{t("alreadyVoted")}</p>
                )}

                <button onClick={handleVote} className="vote-button" disabled={!selectedCandidate}>
                    {t("vote")}
                </button>
            </div>
            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
            />
        </div>
        </>
    );
}
