import { apiClient } from "@/services/apiClient";

export const voteService = {
  castVote: async (electionId: number, candidateId: number) => {
    const { data } = await apiClient.post("/vote/cast", {
      electionId,
      candidateId,
    });
    return data;
  },
};
