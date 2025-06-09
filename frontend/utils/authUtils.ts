// Authentication utility functions for handling different auth states and errors
import { AxiosError } from "axios";

export interface AuthError {
  status: number;
  message: string;
  type:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "INVALID_CREDENTIALS"
    | "SERVER_ERROR"
    | "NETWORK_ERROR"
    | "UNKNOWN";
}

export interface AuthErrorDetails {
  shouldLogout: boolean;
  shouldRedirectToLogin: boolean;
  userMessage: string;
  shouldRetry: boolean;
}

/**
 * Determines the type of authentication error based on status code and message
 */
export function categorizeAuthError(error: any): AuthError {
  if (!error) {
    return {
      status: 0,
      message: "Unknown error occurred",
      type: "UNKNOWN",
    };
  }

  // Handle Axios errors
  if (error.isAxiosError || error.response) {
    const status = error.response?.status || 0;
    const message =
      error.response?.data?.message || error.message || "Request failed";

    switch (status) {
      case 401:
        if (message.toLowerCase().includes("invalid credentials")) {
          return { status, message, type: "INVALID_CREDENTIALS" };
        }
        return { status, message, type: "UNAUTHORIZED" };

      case 403:
        return { status, message, type: "FORBIDDEN" };

      case 500:
      case 502:
      case 503:
      case 504:
        return { status, message, type: "SERVER_ERROR" };

      default:
        if (status >= 400 && status < 500) {
          return { status, message, type: "INVALID_CREDENTIALS" };
        }
        return { status, message, type: "UNKNOWN" };
    }
  }

  // Handle network errors
  if (
    error.code === "NETWORK_ERROR" ||
    error.message?.includes("Network Error")
  ) {
    return {
      status: 0,
      message: "Network connection failed",
      type: "NETWORK_ERROR",
    };
  }

  // Handle generic errors
  return {
    status: 0,
    message: error.message || "Unknown error occurred",
    type: "UNKNOWN",
  };
}

/**
 * Gets detailed handling instructions for different auth error types
 */
export function getAuthErrorDetails(authError: AuthError): AuthErrorDetails {
  switch (authError.type) {
    case "UNAUTHORIZED":
      return {
        shouldLogout: true,
        shouldRedirectToLogin: true,
        userMessage: "Your session has expired. Please log in again.",
        shouldRetry: false,
      };

    case "INVALID_CREDENTIALS":
      return {
        shouldLogout: false,
        shouldRedirectToLogin: false,
        userMessage:
          authError.message ||
          "Invalid login credentials. Please check your username and password.",
        shouldRetry: false,
      };

    case "FORBIDDEN":
      return {
        shouldLogout: false,
        shouldRedirectToLogin: false,
        userMessage: "You do not have permission to access this resource.",
        shouldRetry: false,
      };

    case "SERVER_ERROR":
      return {
        shouldLogout: false,
        shouldRedirectToLogin: false,
        userMessage: "Server error occurred. Please try again later.",
        shouldRetry: true,
      };

    case "NETWORK_ERROR":
      return {
        shouldLogout: false,
        shouldRedirectToLogin: false,
        userMessage:
          "Network connection failed. Please check your internet connection.",
        shouldRetry: true,
      };

    default:
      return {
        shouldLogout: false,
        shouldRedirectToLogin: false,
        userMessage:
          authError.message ||
          "An unexpected error occurred. Please try again.",
        shouldRetry: false,
      };
  }
}

/**
 * Determines if an error indicates the user is not authenticated
 */
export function isAuthenticationError(error: any): boolean {
  const authError = categorizeAuthError(error);
  return (
    authError.type === "UNAUTHORIZED" ||
    authError.type === "INVALID_CREDENTIALS"
  );
}

/**
 * Determines if an error indicates the user lacks proper authorization
 */
export function isAuthorizationError(error: any): boolean {
  const authError = categorizeAuthError(error);
  return authError.type === "FORBIDDEN";
}

/**
 * Determines if the error suggests the user should be logged out
 */
export function shouldLogoutOnError(error: any): boolean {
  const authError = categorizeAuthError(error);
  const details = getAuthErrorDetails(authError);
  return details.shouldLogout;
}

/**
 * Gets a user-friendly error message for authentication errors
 */
export function getAuthErrorMessage(error: any): string {
  const authError = categorizeAuthError(error);
  const details = getAuthErrorDetails(authError);
  return details.userMessage;
}

/**
 * Determines if a failed request should be retried
 */
export function shouldRetryRequest(error: any): boolean {
  const authError = categorizeAuthError(error);
  const details = getAuthErrorDetails(authError);
  return details.shouldRetry;
}

/**
 * Handles authentication errors with appropriate actions
 */
export function handleAuthError(error: any): {
  errorMessage: string;
  shouldLogout: boolean;
  shouldRedirect: boolean;
} {
  const authError = categorizeAuthError(error);
  const details = getAuthErrorDetails(authError);

  return {
    errorMessage: details.userMessage,
    shouldLogout: details.shouldLogout,
    shouldRedirect: details.shouldRedirectToLogin,
  };
}
