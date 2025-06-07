import { API_URL } from '@/config/env';
import { ICandidate } from '@/models/ICandidate';
import { IElection } from '@/models/IElection';
import { IReport } from '@/models/IReport';
import { fetchWithCache } from '@/utils/fetchWithCache';

export class ElectionService {
  private static apiEndpoint = `${API_URL}/elections`;

  public static async getAll(): Promise<IElection[]> {
    const elections: IElection[] = await fetchWithCache<IElection[]>(
      `${this.apiEndpoint}`
    );

    for (let i = 0; i < elections.length; i++) {
      const election = elections[i];
      election.report = await ElectionService.getReport(
        election.election_id || 0
      );
    }

    return elections;
  }

  public static async getAvailable(): Promise<IElection[]> {
    const elections = await fetchWithCache<IElection[]>(
      `${this.apiEndpoint}/available`
    );
    for (let i = 0; i < elections.length; i++) {
      const election = elections[i];
      election.report = await ElectionService.getReport(
        election.election_id || 0
      );
    }
    return elections;
  }

  public static async getById(id: number): Promise<IElection> {
    const election = await fetchWithCache<IElection>(
      `${this.apiEndpoint}/${id}`
    );
    election.report = await ElectionService.getReport(id);
    return election;
  }

  public static async getCandidates(electionId: number): Promise<ICandidate[]> {
    return fetchWithCache<ICandidate[]>(
      `${this.apiEndpoint}/${electionId}/candidates`
    );
  }

  public static async getReport(electionId: number): Promise<IReport[]> {
    return fetchWithCache<IReport[]>(
      `${this.apiEndpoint}/${electionId}/report`
    );
  }
}
