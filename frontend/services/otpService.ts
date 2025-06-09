import { apiClient } from "./apiClient";

export class OtpService {
  private static apiEndpoint = "/otp";

  public static async sendOtp(email: string): Promise<void> {
    const response = await apiClient.post(`${this.apiEndpoint}/send`, {
      email,
    });
    return response.data;
  }
}
