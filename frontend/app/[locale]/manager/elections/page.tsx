"use client";
import { createElection, getElections } from "@/services/managerService";
import { IElection } from "@/models/IElection";
import { useEffect, useState } from "react";
import './Elections.scss';

export default function ElectionsPage() {
    const [elections, setElections] = useState<IElection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newElection, setNewElection] = useState<Omit<IElection, 'election_id'>>({
        title: "",
        start_date: "",
        end_date: "",
        region_id: 0,
        city_id: 0,
    });

    const fetchElections = async () => {
        try {
            setLoading(true);
            const data = await getElections();
            setElections(data);
        } catch (error) {
            console.error("Failed to fetch elections:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchElections();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewElection(prev => ({ ...prev, [name]: name === 'region_id' || name === 'city_id' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure region_id and city_id are numbers before sending
            const electionDataToSend = {
                ...newElection,
                region_id: Number(newElection.region_id),
                city_id: Number(newElection.city_id),
            };
            await createElection(electionDataToSend as IElection); // Cast because createElection expects election_id, but backend should handle it
            setShowForm(false);
            setNewElection({
                title: "",
                start_date: "",
                end_date: "",
                region_id: 0,
                city_id: 0,
            });
            fetchElections(); // Refresh the list
        } catch (error) {
            console.error("Failed to create election:", error);
            // Optionally, display an error message to the user
        }
    };

    if (loading) {
        return <div>Loading elections...</div>;
    }

    return (
        <div className="manager-resource-page">
            <h1>Elections</h1>
            <button onClick={() => setShowForm(!showForm)} className="manager-button">
                {showForm ? "Cancel" : "Add New Election"}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} className="manager-form">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" value={newElection.title} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="start_date">Start Date:</label>
                        <input type="date" id="start_date" name="start_date" value={newElection.start_date} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end_date">End Date:</label>
                        <input type="date" id="end_date" name="end_date" value={newElection.end_date} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="region_id">Region ID:</label>
                        <input type="number" id="region_id" name="region_id" value={newElection.region_id} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city_id">City ID:</label>
                        <input type="number" id="city_id" name="city_id" value={newElection.city_id} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="manager-button submit-button">Create Election</button>
                </form>
            )}
            <ul className="manager-list">
                {elections.map((election) => (
                    <li key={election.election_id} className="manager-list-item">{election.title}</li>
                ))}
            </ul>
        </div>
    );
}

