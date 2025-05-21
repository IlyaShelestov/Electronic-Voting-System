import { API_URL } from "@/config/env";
import { fetchWithCache } from "@/utils/fetchWithCache";
const apiEndpoint = `${API_URL}/elections`;

export const electionService = {
  getAll: async () => {
    return fetchWithCache(`${apiEndpoint}`);
  },

  getAvailable: async () => {
    return fetchWithCache(`${apiEndpoint}/avaliable`);
  },

  getAllLocations: async () => {
    return fetchWithCache(`${apiEndpoint}/locations`);
  },

  getById: async (id: number) => {
    return fetchWithCache(`${apiEndpoint}/${id}`);
  },

  getCandidates: async (electionId: number) => {
    return fetchWithCache(`${apiEndpoint}/${electionId}/candidates`);
  },

  getReport: async (electionId: number) => {
    return fetchWithCache(`${apiEndpoint}/${electionId}/report`);
  },
};
