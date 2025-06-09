import { ILogin } from "@/models/ILogin";
import { IUser } from "@/models/IUser";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import {
  getAuthErrorMessage,
  handleAuthError,
  shouldLogoutOnError,
} from "@/utils/authUtils";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Login thunk
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (loginData: ILogin, { rejectWithValue }) => {
    try {
      await AuthService.login(loginData.iin, loginData.password);
      const user = await UserService.getUser();
      return user;
    } catch (error: any) {
      const { errorMessage, shouldLogout } = handleAuthError(error);

      return rejectWithValue({
        message: errorMessage,
        shouldLogout: false,
      });
    }
  }
);

// Register thunk
export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData: IUser & { password: string }, { rejectWithValue }) => {
    try {
      const newUser = await AuthService.register(userData);
      return newUser;
    } catch (error: any) {
      const { errorMessage } = handleAuthError(error);
      return rejectWithValue({
        message: errorMessage,
        shouldLogout: false,
      });
    }
  }
);

// Logout thunk
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return { message: "Logged out successfully" };
    } catch (error: any) {
      console.error("Logout API error:", error);
      const { errorMessage } = handleAuthError(error);

      return {
        message: "Logged out (local session cleared)",
        apiError: errorMessage,
      };
    }
  }
);

// Initialize authentication thunk
export const initializeAuthAsync = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const user = await UserService.getUser();
      if (!user) {
        throw new Error("No user found");
      }
      return user;
    } catch (error: any) {
      const { errorMessage, shouldLogout } = handleAuthError(error);

      return rejectWithValue({
        message: shouldLogout
          ? "Session expired"
          : "Authentication check failed",
        shouldLogout,
      });
    }
  }
);

// Update user profile thunk
export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async (userData: Partial<IUser>, { rejectWithValue }) => {
    try {
      const updatedUser = await UserService.updateUser(userData);
      return updatedUser;
    } catch (error: any) {
      const { errorMessage, shouldLogout } = handleAuthError(error);

      return rejectWithValue({
        message: errorMessage,
        shouldLogout,
      });
    }
  }
);
