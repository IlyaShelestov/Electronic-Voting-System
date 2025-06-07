"use client";

import './Candidates.scss';

import { useEffect, useState } from 'react';

import { ICandidate } from '@/models/ICandidate';
import { ManagerService } from '@/services/managerService';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newCandidate, setNewCandidate] = useState<Partial<ICandidate>>({
        first_name: "",
        last_name: "",
        iin: "",
        date_of_birth: "",
        city_id: 0,
        phone_number: "",
        email: "",
        bio: "",
        party: "",
        avatar_url: "",
        additional_url_1: "",
        additional_url_2: "",
        election_id: undefined, // Optional
    });

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const data = await ManagerService.getCandidates();
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCandidate(prev => ({ 
            ...prev, 
            [name]: name === 'city_id' || name === 'election_id' ? (value === '' ? undefined : parseInt(value)) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Construct the candidate data, ensuring required IUser fields are present
            const candidateDataToSend: ICandidate = {
                ...newCandidate,
                first_name: newCandidate.first_name || "",
                last_name: newCandidate.last_name || "",
                iin: newCandidate.iin || "",
                date_of_birth: newCandidate.date_of_birth || "",
                city_id: Number(newCandidate.city_id) || 0,
                phone_number: newCandidate.phone_number || "",
                email: newCandidate.email || "",
                bio: newCandidate.bio || "",
                party: newCandidate.party || "",
            };
            await ManagerService.createCandidate(candidateDataToSend);
            setShowForm(false);
            setNewCandidate({ // Reset form
                first_name: "", last_name: "", iin: "", date_of_birth: "", city_id: 0, phone_number: "", email: "",
                bio: "", party: "", avatar_url: "", additional_url_1: "", additional_url_2: "", election_id: undefined
            });
            fetchCandidates(); // Refresh the list
        } catch (error) {
            console.error("Failed to create candidate:", error);
        }
    };

    if (loading) {
        return <div className="loading-message">Loading candidates...</div>;
    }

    return (
        <div className="manager-resource-page">
            <h1>Candidates</h1>
            <button onClick={() => setShowForm(!showForm)} className="manager-button">
                {showForm ? "Cancel" : "Add New Candidate"}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} className="manager-form">
                    {/* IUser Fields */}
                    <div className="form-group">
                        <label htmlFor="first_name">First Name:</label>
                        <input type="text" id="first_name" name="first_name" value={newCandidate.first_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name:</label>
                        <input type="text" id="last_name" name="last_name" value={newCandidate.last_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="iin">IIN:</label>
                        <input type="text" id="iin" name="iin" value={newCandidate.iin} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date_of_birth">Date of Birth:</label>
                        <input type="date" id="date_of_birth" name="date_of_birth" value={newCandidate.date_of_birth} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city_id">City ID:</label>
                        <input type="number" id="city_id" name="city_id" value={newCandidate.city_id || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number:</label>
                        <input type="text" id="phone_number" name="phone_number" value={newCandidate.phone_number} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={newCandidate.email} onChange={handleInputChange} required />
                    </div>
                    
                    {/* ICandidate Fields */}
                    <div className="form-group">
                        <label htmlFor="bio">Bio:</label>
                        <textarea id="bio" name="bio" value={newCandidate.bio} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="party">Party:</label>
                        <input type="text" id="party" name="party" value={newCandidate.party} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="avatar_url">Avatar URL (Optional):</label>
                        <input type="text" id="avatar_url" name="avatar_url" value={newCandidate.avatar_url} onChange={handleInputChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="election_id">Election ID (Optional):</label>
                        <input type="number" id="election_id" name="election_id" value={newCandidate.election_id || ''} onChange={handleInputChange} />
                    </div>
                    {/* Add additional_url_1 and additional_url_2 if needed */}
                    <button type="submit" className="manager-button submit-button">Create Candidate</button>
                </form>
            )}
            <ul className="manager-list">
                {candidates.map((candidate) => (
                    <li key={candidate.candidate_id} className="manager-list-item">
                        {candidate.first_name} {candidate.last_name} ({candidate.party})
                    </li>
                ))}
            </ul>
        </div>
    );
}

