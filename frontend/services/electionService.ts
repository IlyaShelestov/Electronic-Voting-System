import { API_URL } from "@/config/env";
import { ICandidate } from "@/models/ICandidate";
import { IElection } from "@/models/IElection";
import { IReport } from "@/models/IReport";
import { fetchWithCache } from "@/utils/fetchWithCache";

export class ElectionService {
  private static apiEndpoint = `${API_URL}/elections`;
  private static reportCache: Map<number, IReport[]> = new Map();

  public static async getAll(
    includeReports: boolean = false
  ): Promise<IElection[]> {
    const elections: IElection[] = await fetchWithCache<IElection[]>(
      `${this.apiEndpoint}`
    );

    if (includeReports) {
      await this.attachReportsToElections(elections);
    }

    return elections;
  }

  public static async getAvailable(
    includeReports: boolean = false
  ): Promise<IElection[]> {
    const elections = await fetchWithCache<IElection[]>(
      `${this.apiEndpoint}/available`
    );

    if (includeReports) {
      await this.attachReportsToElections(elections);
    }

    return elections;
  }
  private static async attachReportsToElections(
    elections: IElection[]
  ): Promise<void> {
    const reportPromises = elections.map(async (election) => {
      const id = election.election_id || 0;
      if (!this.reportCache.has(id)) {
        const report = await this.getReport(id);
        this.reportCache.set(id, report);
      }
      election.report = this.reportCache.get(id);
    });

    await Promise.all(reportPromises);
  }
  public static async getById(id: number): Promise<IElection> {
    const election = await fetchWithCache<IElection>(
      `${this.apiEndpoint}/${id}`
    );

    if (!this.reportCache.has(id)) {
      const report = await this.getReport(id);
      this.reportCache.set(id, report);
    }
    election.report = this.reportCache.get(id);

    return election;
  }
  public static async getCandidates(id: number): Promise<ICandidate[]> {
    return fetchWithCache<ICandidate[]>(`${this.apiEndpoint}/${id}/candidates`);
  }

  public static async getReport(id: number): Promise<IReport[]> {
    if (this.reportCache.has(id)) {
      return this.reportCache.get(id)!;
    }

    const report = await fetchWithCache<IReport[]>(
      `${this.apiEndpoint}/${id}/report`
    );

    this.reportCache.set(id, report);
    return report;
  }

  public static clearReportCache(): void {
    this.reportCache.clear();
  }

  public static invalidateElectionCache(id: number): void {
    this.reportCache.delete(id);
  }
}
