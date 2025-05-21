import { API_URL } from "@/config/env";
import { fetchWithCache } from "@/utils/fetchWithCache";
import { ICity } from "@/models/ICity";
import { IElection } from "@/models/IElection";
import { ICandidate } from "@/models/ICandidate";
import { IReport } from "@/models/IReport";

const apiEndpoint = `${API_URL}/elections`;

export const electionService = {
  getAll: async (): Promise<IElection[]> => {
    return fetchWithCache<IElection[]>(`${apiEndpoint}`);
  },

  getAvailable: async (): Promise<IElection[]> => {
    return fetchWithCache<IElection[]>(`${apiEndpoint}/avaliable`);
  },

  getById: async (id: number): Promise<IElection> => {
    return fetchWithCache<IElection>(`${apiEndpoint}/${id}`);
  },

  getCandidates: async (electionId: number): Promise<ICandidate[]> => {
    return fetchWithCache<ICandidate[]>(
      `${apiEndpoint}/${electionId}/candidates`
    );
  },

  getReport: async (electionId: number): Promise<IReport[]> => {
    return fetchWithCache<IReport[]>(`${apiEndpoint}/${electionId}/report`);
  },
};
