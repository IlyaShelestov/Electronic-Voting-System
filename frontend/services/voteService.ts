import { apiClient } from "@/services/apiClient";

export const voteService = {
  apiEndpoint: "/vote",
  castVote: async (electionId: number, candidateId: number) => {
    try {
      const { data } = await apiClient.post(`${voteService.apiEndpoint}/cast`, {
        electionId,
        candidateId,
      });
      return data;
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  },

  checkVoted: async (electionId: number) => {
    try {
      const { data } = await apiClient.get(`${voteService.apiEndpoint}/status/${electionId}`);
      return data;
    } catch (error) {
      console.error("Error checking vote status:", error);
      throw error;
    }
  },

  checkVoteLocation: async (electionId: number) => {
    try {
      const { data } = await apiClient.get(`${voteService.apiEndpoint}/location/${electionId}`);
      return data;
    } catch (error) {
      console.error("Error checking vote location:", error);
      throw error;
    }
  },

  checkVoteToken: async (token: string) => {
    try {
      const { data } = await apiClient.post(`${voteService.apiEndpoint}/token`, { token });
      return data;
    } catch (error) {
      console.error("Error validating vote token:", error);
      throw error;
    }
  },
};
