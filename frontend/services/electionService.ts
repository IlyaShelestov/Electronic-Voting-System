const API_URL = "http://localhost:5000/api/elections"; // Ensure this matches your backend route

export const electionService = {
  // Fetch all elections
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}`, {
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

  // Fetch available elections for a specific region and city
  getAvailable: async () => {
    try {
      const response = await fetch(`${API_URL}/avaliable`, {
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

  // Fetch all locations (regions & cities)
  getAllLocations: async () => {
    try {
      const response = await fetch(`${API_URL}/locations`, {
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

  // Fetch election details by ID
  getById: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
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

  // Fetch candidates for a specific election
  getCandidates: async (electionId: number) => {
    try {
      const response = await fetch(`${API_URL}/${electionId}/candidates`, {
        method: "GET",
        credentials: "include",
      });
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
      const response = await fetch(`${API_URL}/${electionId}/report`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Failed to fetch report for election ${electionId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching report for election ${electionId}:`, error);
      throw error;
    }
  },
};
