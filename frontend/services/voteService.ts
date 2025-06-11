import { apiClient } from "@/services/apiClient";

export class VoteService {
  private static apiEndpoint = "/vote";
  public static async castVote(
    electionId: number,
    candidateId: number,
    otp?: string
  ) {
    try {
      const { data } = await apiClient.post(`${this.apiEndpoint}/cast`, {
        electionId,
        candidateId,
        otp,
      });

      console.log("Vote cast response:", data);

      // Ensure we return the token from the response
      if (data && typeof data === "string") {
        // If the response is just a token string
        return { token: data, success: true };
      } else if (data && data.token) {
        // If the response is an object with a token property
        return { ...data, success: true };
      } else {
        // Fallback if no token is found
        console.warn("No token found in vote response:", data);
        return { token: null, success: true, ...data };
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
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
