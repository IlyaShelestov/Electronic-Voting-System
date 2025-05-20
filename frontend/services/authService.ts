import { apiClient } from "@/services/apiClient";
import { AuthResponse } from "@/models/IAuthResponse";
import { IUser } from "@/models/IUser";

export const authService = {
  login: async (iin: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      iin,
      password,
    });
    return data;
  },

  register: async (userData: IUser): Promise<IUser> => {
    const { data } = await apiClient.post<IUser>("/auth/register", userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
