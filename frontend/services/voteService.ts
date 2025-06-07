import { apiClient } from "@/services/apiClient";

export class VoteService {
  private static apiEndpoint = "/vote";
  public static async castVote(
    electionId: number,
    candidateId: number,
    otp?: string
  ) {
    const { data } = await apiClient.post(`${this.apiEndpoint}/cast`, {
      electionId,
      candidateId,
      otp,
    });
    return data;
  }

  public static async checkVotedStatus(electionId: number) {
    const { data } = await apiClient.get(
      `${this.apiEndpoint}/status/${electionId}`
    );
    return data;
  }

  public static async checkVoteLocation(electionId: number) {
    const { data } = await apiClient.get(
      `${this.apiEndpoint}/location/${electionId}`
    );
    return data;
  }

  public static async checkVoteToken(token: string) {
    const { data } = await apiClient.post(`${this.apiEndpoint}/token`, {
      token,
    });
    return data;
  }
}
