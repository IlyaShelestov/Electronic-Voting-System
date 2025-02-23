import { API_URL } from "@/config/env";

export const voteService = {
  api: API_URL + "/vote",
  castVote: async (electionId: number, candidateId: number) => {
    try {
      const response = await fetch(`${API_URL}/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ electionId, candidateId }),
      });

      if (!response.ok) throw new Error("Failed to cast vote");
      return await response.json();
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  },

  checkVoted: async (electionId: number) => {
    try {
      const response = await fetch(`${API_URL}/status/${electionId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to check voting status");
      return await response.json();
    } catch (error) {
      console.error("Error checking vote status:", error);
      throw error;
    }
  },

  checkVoteLocation: async (electionId: number) => {
    try {
      const response = await fetch(`${API_URL}/location/${electionId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to check voting location");
      return await response.json();
    } catch (error) {
      console.error("Error checking vote location:", error);
      throw error;
    }
  },

  checkVoteToken: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      if (!response.ok) throw new Error("Failed to validate vote token");
      return await response.json();
    } catch (error) {
      console.error("Error validating vote token:", error);
      throw error;
    }
  },
};
