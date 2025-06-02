import { apiClient } from "@/services/apiClient";
import { IUser } from "@/models/IUser";

export class UserService {
  public static async getUser(): Promise<IUser> {
    const { data } = await apiClient.get<IUser>("/users/me");
    return data;
  }
}
