import { apiClient } from "@/services/apiClient";

export const voteService = {
  castVote: async (electionId: number, candidateId: number, otp?: string) => {
    const { data } = await apiClient.post("/vote/cast", {
      electionId,
      candidateId,
      otp,
    });
    return data;
  },

  checkVotedStatus: async (electionId: number) => {
    const { data } = await apiClient.get(`/vote/status/${electionId}`);
    return data;
  },

  checkVoteLocation: async (electionId: number) => {
    const { data } = await apiClient.get(`/vote/location/${electionId}`);
    return data;
  },

  checkVoteToken: async (token: string) => {
    const { data } = await apiClient.post("/vote/token", { token });
    return data;
  },
};
