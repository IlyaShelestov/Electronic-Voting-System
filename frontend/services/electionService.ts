import { ICandidate } from "@/models/ICandidate";
import { IElection } from "@/models/IElection";
import { IReport } from "@/models/IReport";

import { apiClient } from "./apiClient";

export class ElectionService {
  private static apiEndpoint = "/elections";
  private static reportCache: Map<number, IReport[]> = new Map();
  public static async getAll(
    includeReports: boolean = false
  ): Promise<IElection[]> {
    const { data: elections } = await apiClient.get<IElection[]>(
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
    const { data: elections } = await apiClient.get<IElection[]>(
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
    const { data: election } = await apiClient.get<IElection>(
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
    const { data } = await apiClient.get<ICandidate[]>(
      `${this.apiEndpoint}/${id}/candidates`
    );
    return data;
  }

  public static async getReport(id: number): Promise<IReport[]> {
    if (this.reportCache.has(id)) {
      return this.reportCache.get(id)!;
    }

    const { data: report } = await apiClient.get<IReport[]>(
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
