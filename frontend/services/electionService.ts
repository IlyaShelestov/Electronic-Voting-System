import { API_URL } from "@/config/env";

export const electionService = {
  api: API_URL + "/elections",
  getAll: async () => {
    try {
      const response = await fetch(`${electionService.api}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch elections");
      return await response.json();
    } catch (error) {
      console.error("Error fetching elections:", error);
      throw error;
    }
  },

  getAvailable: async () => {
    try {
      const response = await fetch(`${electionService.api}/avaliable`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch available elections");
      return await response.json();
    } catch (error) {
      console.error("Error fetching available elections:", error);
      throw error;
    }
  },

  getAllLocations: async () => {
    try {
      const response = await fetch(`${electionService.api}/locations`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch locations");
      return await response.json();
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${electionService.api}/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch election ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching election ${id}:`, error);
      throw error;
    }
  },

  getCandidates: async (electionId: number) => {
    try {
      const response = await fetch(
        `${electionService.api}/${electionId}/candidates`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch candidates for election ${electionId}`
        );
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching candidates for election ${electionId}:`,
        error
      );
      throw error;
    }
  },

  getReport: async (electionId: number) => {
    try {
      const response = await fetch(
        `${electionService.api}/${electionId}/report`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error(`Failed to fetch report for election ${electionId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching report for election ${electionId}:`, error);
      throw error;
    }
  },
};
