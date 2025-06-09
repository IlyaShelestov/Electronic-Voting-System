import { IUser } from "@/models/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  initializeAuthAsync,
  loginAsync,
  logoutAsync,
  registerAsync,
  updateUserAsync,
} from "./authThunks";

interface AuthErrorPayload {
  message: string;
  shouldLogout: boolean;
}

interface UserState {
  isAuthenticated: boolean;
  user: null | IUser;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    login(state, action: PayloadAction<IUser>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError(state) {
      state.error = null;
    },
    // New action to handle forced logout due to auth errors
    forceLogout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = "Session expired. Please log in again.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;

        const payload = action.payload as AuthErrorPayload;
        state.error = payload?.message || "Login failed";
      });

    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;

        const payload = action.payload as AuthErrorPayload;
        state.error = payload?.message || "Registration failed";
      });

    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Always clear auth state on logout, even if API call failed
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });

    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuthAsync.rejected, (state, action) => {
        const payload = action.payload as AuthErrorPayload;

        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;

        // Only set error if it's not a logout scenario
        if (!payload?.shouldLogout) {
          state.error = payload?.message || null;
        } else {
          state.error = null; // Clear error for logout scenarios
        }
      });

    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;

        const payload = action.payload as AuthErrorPayload;
        state.error = payload?.message || "Update failed";

        // If the error requires logout, clear auth state
        if (payload?.shouldLogout) {
          state.isAuthenticated = false;
          state.user = null;
        }
      });
  },
});

export const {
  login,
  logout,
  setLoading,
  setError,
  updateUser,
  clearError,
  forceLogout,
} = userSlice.actions;

export default userSlice.reducer;
