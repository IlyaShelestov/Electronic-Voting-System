import { apiClient } from "@/services/apiClient";
import { AuthResponse } from "@/models/IAuthResponse";
import { IUser } from "@/models/IUser";

export class AuthService {
  public static async login(iin: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", {
      iin,
      password,
    });

    return response.data;
  }

  public static async register(userData: IUser): Promise<IUser> {
    const { data } = await apiClient.post<IUser>("/auth/register", userData);
    return data;
  }

  public static async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  }
}
