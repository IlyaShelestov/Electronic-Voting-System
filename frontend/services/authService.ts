import { AuthResponse } from "@/models/IAuthResponse";
import { apiClient } from "@/services/apiClient";
import { removeAuthToken } from "@/utils/tokenHelper";
import { IUser } from "@/models/IUser";

export const authService = {
  apiEndpoint: "/auth",

  login: async (
    iin: string,
    password: string
  ): Promise<AuthResponse | null> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${authService.apiEndpoint}/login`,
        { iin, password }
      );

      if (response.status === 403) {
        console.warn("User is already logged in.");
        return null;
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.warn("403 Forbidden: User is already logged in.");
        return null;
      }
      console.error("Login Error:", error);
      throw error;
    }
  },

  register: async (userData: IUser): Promise<IUser> => {
    try {
      const { data } = await apiClient.post<IUser>("/auth/register", userData);
      return data;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(`${authService.apiEndpoint}/logout`);
      removeAuthToken();

      console.info("User successfully logged out.");
    } catch (error) {
      console.error("Logout Error:", error);
      removeAuthToken();

      throw error;
    }
  },
};
