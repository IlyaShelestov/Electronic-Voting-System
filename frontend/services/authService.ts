const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  login: async (iin: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ iin, password }),
      });

      if (!response.ok) throw new Error("Failed to login");

      const data = await response.json();

      document.cookie = `authToken=${data.token}; path=/; Secure; HttpOnly`;

      return data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error("Registration failed");

      return await response.json();
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },
};
