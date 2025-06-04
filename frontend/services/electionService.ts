import { API_URL } from "@/config/env";
import { fetchWithCache } from "@/utils/fetchWithCache";
import { ICity } from "@/models/ICity";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import { IReport } from "@/models/IReport";



export class ElectionService {
  private static apiEndpoint = `${API_URL}/elections`;



  public static async getAll(): Promise<IElection[]> {
    return fetchWithCache<IElection[]>(`${this.apiEndpoint}`);
  }

  public static async getAvailable(): Promise<IElection[]> {
    return fetchWithCache<IElection[]>(`${this.apiEndpoint}/avaliable`);
  }

  public static async getById(id: number): Promise<IElection> {
    return fetchWithCache<IElection>(`${this.apiEndpoint}/${id}`);
  }

  public static async getCandidates(electionId: number): Promise<ICandidate[]> {
    return fetchWithCache<ICandidate[]>(
      `${this.apiEndpoint}/${electionId}/candidates`
    );
  }

  public static async getReport(electionId: number): Promise<IReport[]> {
    return fetchWithCache<IReport[]>(`${this.apiEndpoint}/${electionId}/report`);
  }
}
