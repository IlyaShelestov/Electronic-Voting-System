import { API_URL } from "@/config/env";

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

async function fetchWithCache(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "force-cache",
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
