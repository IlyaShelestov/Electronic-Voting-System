"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { electionService } from "@/services/electionService";
import { voteService } from "@/services/voteService";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import "./Vote.scss";
import { setLoading } from "@/store/slices/loadingSlice";

export default function VotePage() {
    const searchParams = useSearchParams();
    const queryElectionId = searchParams.get("electionId");
    const queryCandidateId = searchParams.get("candidateId");

    const [elections, setElections] = useState<IElection[]>([]);
    const [selectedElection, setSelectedElection] = useState<number | null>(null);
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await electionService.getAll();
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
                    const data = await electionService.getCandidates(selectedElection);
                    setCandidates(data);

                    if (queryCandidateId) {
                        const candidateExists = data.some(
                            (candidate: { candidate_id: number; }) => candidate.candidate_id === Number(queryCandidateId)
                        );
                        if (candidateExists) {
                            setSelectedCandidate(Number(queryCandidateId));
                        }
                    }
                } catch (error) {
                    toast.error("Ошибка загрузки кандидатов.");
                    console.error("Error fetching candidates:", error);
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
            await voteService.castVote(Number(selectedElection), selectedCandidate);
        } catch (error) {
            console.error("Ошибка голосования:", error);
        }
    };


    return (
        <div className="vote-container">
            <h1 className="vote-title">Отдать свой голос</h1>
            <div className="vote-box">
                <label htmlFor="election-select">Выбрать категорию голосования</label>
                <select
                    id="election-select"
                    value={selectedElection ?? ""}
                    onChange={handleElectionChange}
                >
                    <option value="">Выберите выборы</option>
                    {elections.map((election) => (
                        <option key={election.election_id} value={election.election_id}>
                            {election.title}
                        </option>
                    ))}
                </select>


                <button onClick={handleVote} className="vote-button" disabled={!selectedCandidate}>
                    Проголосовать
                </button>
            </div>
        </div>
    );
}
