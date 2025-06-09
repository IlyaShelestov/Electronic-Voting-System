import { AuthResponse } from "@/models/IAuthResponse";
import { IUser } from "@/models/IUser";
import { apiClient } from "@/services/apiClient";

export class AuthService {
  private static apiEndpoint = "/auth";
  public static async login(
    iin: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post(`${this.apiEndpoint}/login`, {
      iin,
      password,
    });

    return response.data;
  }

  public static async register(userData: IUser): Promise<IUser> {
    const { data } = await apiClient.post<IUser>(
      `${this.apiEndpoint}/register`,
      userData
    );
    return data;
  }

  public static async logout(): Promise<void> {
    await apiClient.post(`${this.apiEndpoint}/logout`);
  }
}
