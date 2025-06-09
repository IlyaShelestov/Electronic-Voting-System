import { IRequest } from "@/models/IRequest";
import { IUser } from "@/models/IUser";
import { apiClient } from "@/services/apiClient";

export interface FieldChangeRequest {
  field_name:
    | "phone_number"
    | "email"
    | "city_id"
    | "first_name"
    | "last_name"
    | "patronymic";
  new_value: string;
}

export class UserService {
  private static apiEndpoint = "/users";

  public static async getUser(): Promise<IUser> {
    const { data } = await apiClient.get<IUser>(`${this.apiEndpoint}/me`);
    return data;
  }

  public static async updateUser(userData: Partial<IUser>): Promise<IUser> {
    const { data } = await apiClient.put<IUser>(
      `${this.apiEndpoint}/me`,
      userData
    );
    return data;
  }

  public static async sendFieldChangeRequest(
    request: FieldChangeRequest
  ): Promise<void> {
    const response = await apiClient.post(
      `${this.apiEndpoint}/me/request-change`,
      request
    );
    if (response.status !== 201) {
      throw new Error("Failed to send field change request");
    }
  }

  public static async getUserRequests(): Promise<IRequest[]> {
    const { data } = await apiClient.get<IRequest[]>(
      `${this.apiEndpoint}/me/requests`
    );
    return data;
  }
}
