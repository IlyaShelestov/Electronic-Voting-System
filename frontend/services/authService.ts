import { apiClient } from "@/services/apiClient";
import { AuthResponse } from "@/models/IAuthResponse";
import { IUser } from "@/models/IUser";

export const authService = {
  login: async (iin: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", {
      iin,
      password,
    });
    console.log(response);
    return response.data;
  },

  register: async (userData: IUser): Promise<IUser> => {
    const { data } = await apiClient.post<IUser>("/auth/register", userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
