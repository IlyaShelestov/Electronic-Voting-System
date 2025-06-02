import { apiClient } from './apiClient';
import { IElection } from '@/models/IElection';
import { ICandidate } from '@/models/ICandidate';
import { IEvent } from '@/models/IEvent';
import { ElectionService } from './electionService';
    
export class ManagerService {
    public static async createElection(electionData: IElection) {
        const response = await apiClient.post('/manager/elections', electionData);
        if (response.status !== 200) {
            throw new Error('Failed to create election');
        }
        return response.data;
    }

    public static async deleteElection(electionId: number) {
        const response = await apiClient.delete(`/manager/elections/${electionId}`);
    if (response.status !== 200) {
        throw new Error('Failed to delete election');
    }
    return response.data;
}

    public static async createCandidate(candidateData: ICandidate) {
        const response = await apiClient.post('/manager/candidates', candidateData);
        if (response.status !== 200) {
            throw new Error('Failed to create candidate');
        }
        return response.data;
    }

    public static async deleteCandidate(candidateId: number) {
        const response = await apiClient.delete(`/manager/candidates/${candidateId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete candidate');
        }
        return response.data;
    }

    public static async updateCandidate(candidateId: number, candidateData: ICandidate) {
        const response = await apiClient.put(`/manager/candidates/${candidateId}`, candidateData);
        if (response.status !== 200) {
            throw new Error('Failed to update candidate');
        }
        return response.data;
    }

    public static async attachCandidate(electionId: number, candidateId: number) {
        const response = await apiClient.post(`/manager/elections/${electionId}/candidates/${candidateId}`);
        if (response.status !== 200) {
            throw new Error('Failed to attach candidate');
        }
        return response.data;
    }

    public static async createEvent(eventData: IEvent) {
        const response = await apiClient.post('/manager/events', eventData);
        if (response.status !== 200) {
            throw new Error('Failed to create event');
        }
        return response.data;
    }

    public static async deleteEvent(eventId: number) {
        const response = await apiClient.delete(`/manager/events/${eventId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete event');
        }
        return response.data;
    }

    public static async updateEvent(eventId: number, eventData: IEvent) {
        const response = await apiClient.put(`/manager/events/${eventId}`, eventData);
        if (response.status !== 200) {
            throw new Error('Failed to update event');
        }
        return response.data;
    }

    public static async getElections() {
        const response = await ElectionService.getAll() ;
        return response;
    }

    public static async getCandidates() {
        const response = await apiClient.get('/candidates');
        if (response.status !== 200) {
            throw new Error('Failed to fetch candidates');
        }
        return response.data as ICandidate[];
    }

    public static async getEvents() {
        const response = await apiClient.get('/events');
        if (response.status !== 200) {
            throw new Error('Failed to fetch events');
        }
        return response.data as IEvent[];
    }

}