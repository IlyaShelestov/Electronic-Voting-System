"use client";

import { useEffect, useState } from "react";
import { electionService } from "@/services/electionService";
import { voteService } from "@/services/voteService";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import "./Vote.scss";

export default function VotePage() {
    const [elections, setElections] = useState<IElection[]>([]);
    const [selectedElection, setSelectedElection] = useState<number | null>(null);
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await electionService.getAll();
                setElections(data);
            } catch (error) {
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
                    const data = await electionService.getCandidates(selectedElection);
                    setCandidates(data);
                } catch (error) {
                    console.error("Error fetching candidates:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // ✅ Reset candidates when default option is selected
                setCandidates([]);
                setSelectedCandidate(null);
            }
        };

        fetchCandidates();
    }, [selectedElection]);

    const handleElectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const electionId = e.target.value ? Number(e.target.value) : null;
        setSelectedElection(electionId);
    };

    const handleVote = async () => {
        if (!selectedCandidate) {
            alert("Выберите кандидата перед голосованием!");
            return;
        }

        try {
            await voteService.castVote(Number(selectedElection), selectedCandidate);
            alert("Ваш голос успешно отправлен!");
        } catch (error) {
            console.error("Ошибка голосования:", error);
            alert("Ошибка при голосовании.");
        }
    };

    return (
        <div className="vote-container">
            <h1 className="vote-title">Отдать свой голос</h1>
            <div className="vote-box">
                <label htmlFor="election-select">Выбрать категорию голосования</label>
                <select id="election-select" value={selectedElection ?? ""} onChange={handleElectionChange}>
                    <option value="">Выберите выборы</option>
                    {elections.map((election) => (
                        <option key={election.election_id} value={election.election_id}>
                            {election.title}
                        </option>
                    ))}
                </select>

                {loading ? (
                    <p>Загрузка кандидатов...</p>
                ) : (
                    <ul className="candidate-list">
                        {candidates.map((candidate) => (
                            <li key={candidate.candidate_id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="candidate"
                                        value={candidate.candidate_id}
                                        checked={selectedCandidate === candidate.candidate_id}
                                        onChange={() => setSelectedCandidate(candidate.candidate_id)}
                                    />
                                    {candidate.first_name + " " + candidate.last_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}

                <button onClick={handleVote} className="vote-button" disabled={!selectedCandidate}>
                    Проголосовать
                </button>
            </div>
        </div>
    );
}
