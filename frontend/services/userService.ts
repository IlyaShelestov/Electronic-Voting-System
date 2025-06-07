import { apiClient } from "@/services/apiClient";
import { IUser } from "@/models/IUser";

export class UserService {
  private static apiEndpoint = "/users";
  public static async getUser(): Promise<IUser> {
    const { data } = await apiClient.get<IUser>(`${this.apiEndpoint}/me`);
    return data;
  }

  public static async sendRequest(): Promise<void> {
    const response = await apiClient.post(`${this.apiEndpoint}/request`);
    if (response.status !== 200) {
      throw new Error("Failed to send request");
    }
  }
}
