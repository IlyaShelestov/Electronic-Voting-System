import { apiClient } from "@/services/apiClient";

export class VoteService {  
  public static async castVote(electionId: number, candidateId: number, otp?: string) {
    const { data } = await apiClient.post("/vote/cast", {
      electionId,
      candidateId,
      otp,
    });
    return data;
  }

  public static async checkVotedStatus(electionId: number) {
    const { data } = await apiClient.get(`/vote/status/${electionId}`);
    return data;
  }

  public static async checkVoteLocation(electionId: number) {
    const { data } = await apiClient.get(`/vote/location/${electionId}`);
    return data;
  }

  public static async checkVoteToken(token: string) {
    const { data } = await apiClient.post("/vote/token", { token });
    return data;
  }
}
