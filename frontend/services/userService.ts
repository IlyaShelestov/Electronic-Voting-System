import { apiClient } from "@/services/apiClient";
import { IUser } from "@/models/IUser";

export const userService = {
  getCurrentUser: async (): Promise<IUser> => {
    const { data } = await apiClient.get<IUser>("/users/me");
    return data;
  },
};
