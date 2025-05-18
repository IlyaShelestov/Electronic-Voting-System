import { apiClient } from "@/services/apiClient";
import { IUser } from "@/models/IUser";

export const userService = {
  apiEndpoint: "/users",
  getUser: async (): Promise<IUser | null> => {

    try {
      const { data } = await apiClient.get<IUser>(userService.apiEndpoint + "/me");
      if (!data) {
        console.warn("User not found.");
        return null;
      }
      return data;
    } catch (error) {
      console.error("Get User Error:", error);
      return null;
    }
  },
};
