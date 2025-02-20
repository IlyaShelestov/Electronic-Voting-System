const API_URL = "http://localhost:5000/api/users";
export const userService = {
  getUser: async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to get user");

      return await response.json();
    } catch (error) {
      console.error("Get User Error:", error);
      throw error;
    }
  },
};
