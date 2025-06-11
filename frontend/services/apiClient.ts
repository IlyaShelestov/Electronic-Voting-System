import axios from "axios";

import { API_URL } from "@/config/env";
import { getAuthErrorMessage, shouldLogoutOnError } from "@/utils/authUtils";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle authentication errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle authentication/authorization errors
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized errors
      if (status === 401) {
        const shouldLogout = shouldLogoutOnError(error);

        if (shouldLogout) {
          // Clear any authentication state and redirect to login
          // This will be handled by the auth hooks/thunks
          console.warn("Authentication expired, user will be logged out");

          // Dispatch a custom event that can be listened to by auth components
          window.dispatchEvent(
            new CustomEvent("auth:unauthorized", {
              detail: { error, shouldLogout: true },
            })
          );
        }
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.warn("Access forbidden for current user");

        // Dispatch a custom event for forbidden access
        window.dispatchEvent(
          new CustomEvent("auth:forbidden", {
            detail: { error },
          })
        );
      }

      if (status === 429) {
        // Handle rate limiting errors
        console.warn("Too many requests, rate limit exceeded");
        return Promise.reject({
          message: "Too many requests, please try again later.",
          status: 429,
        });
      }
    }

    // Re-throw the error so it can be handled by the calling code
    return Promise.reject(error);
  }
);
