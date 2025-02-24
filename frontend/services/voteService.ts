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
};
