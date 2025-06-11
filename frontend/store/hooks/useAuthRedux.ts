import { useCallback, useEffect } from "react";

import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/components/ToastNotification/ToastNotification";
import { ILogin } from "@/models/ILogin";
import { IUser } from "@/models/IUser";
import { UserRoleEnum } from "@/models/UserRole";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsManager,
  selectIsUser,
  selectUser,
  selectUserEmail,
  selectUserFullName,
  selectUserRole,
} from "@/store/selectors/authSelectors";
import {
  initializeAuthAsync,
  loginAsync,
  logoutAsync,
  registerAsync,
  updateUserAsync,
} from "@/store/slices/authThunks";
import { clearError, forceLogout } from "@/store/slices/userSlice";

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isManager = useAppSelector(selectIsManager);
  const isUser = useAppSelector(selectIsUser);
  const userEmail = useAppSelector(selectUserEmail);
  const userFullName = useAppSelector(selectUserFullName);

  // Listen for auth events from API interceptors
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      const { shouldLogout } = event.detail;

      if (shouldLogout && isAuthenticated) {
        dispatch(forceLogout());
        showErrorToast("Your session has expired. Please log in again.");
      }
    };

    const handleForbidden = (event: CustomEvent) => {
      showErrorToast(
        "Access denied. You don't have permission to perform this action."
      );
    };

    // Add event listeners
    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized as EventListener
    );
    window.addEventListener("auth:forbidden", handleForbidden as EventListener);

    // Cleanup event listeners
    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized as EventListener
      );
      window.removeEventListener(
        "auth:forbidden",
        handleForbidden as EventListener
      );
    };
  }, [dispatch, isAuthenticated]);

  const login = useCallback(
    async (loginData: ILogin) => {
      try {
        const result = await dispatch(loginAsync(loginData));
        if (loginAsync.fulfilled.match(result)) {
          showSuccessToast("Login successful! Welcome back.");
          return result;
        } else {
          const errorPayload = result.payload as {
            message: string;
            shouldLogout: boolean;
          };
          const errorMessage = errorPayload?.message || "Login failed";
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || "Login failed";
        showErrorToast(errorMessage);
        throw error;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData: IUser & { password: string }) => {
      try {
        const result = await dispatch(registerAsync(userData));
        if (registerAsync.fulfilled.match(result)) {
          showSuccessToast(
            "Registration successful! Please check your email for verification."
          );
          return result;
        } else {
          const errorPayload = result.payload as {
            message: string;
            shouldLogout: boolean;
          };
          const errorMessage = errorPayload?.message || "Registration failed";
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || "Registration failed";
        showErrorToast(errorMessage);
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync());
      showInfoToast("You have been logged out successfully.");
    } catch (error: any) {
      console.error("Logout error:", error);
      showInfoToast("Logged out (local session cleared).");
    }
  }, [dispatch]);

  const initializeAuth = useCallback(() => {
    return dispatch(initializeAuthAsync());
  }, [dispatch]);
  const updateUser = useCallback(
    async (userData: Partial<IUser>) => {
      try {
        const result = await dispatch(updateUserAsync(userData));
        if (updateUserAsync.fulfilled.match(result)) {
          showSuccessToast("Profile updated successfully!");
          return result;
        } else {
          const errorPayload = result.payload as {
            message: string;
            shouldLogout: boolean;
          };
          const errorMessage = errorPayload?.message || "Update failed";

          // If the error requires logout, handle it
          if (errorPayload?.shouldLogout && isAuthenticated) {
            dispatch(forceLogout());
            showErrorToast("Session expired. Please log in again.");
          } else {
            showErrorToast(errorMessage);
          }

          throw new Error(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || "Update failed";
        showErrorToast(errorMessage);
        throw error;
      }
    },
    [dispatch, isAuthenticated]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  // Permission checks
  const hasPermission = useCallback(
    (requiredRole: "admin" | "manager" | "user") => {
      if (!isAuthenticated || !userRole) return false;

      const roleHierarchy: { [key: string]: number } = {
        admin: 3,
        manager: 2,
        user: 1,
        candidate: 1,
      };

      const currentRoleLevel = roleHierarchy[userRole] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      return currentRoleLevel >= requiredRoleLevel;
    },
    [isAuthenticated, userRole]
  );

  const canAccessAdmin = useCallback(() => {
    return hasPermission("admin");
  }, [hasPermission]);
  const canAccessManager = useCallback(() => {
    return hasPermission("manager");
  }, [hasPermission]);

  const hasRole = useCallback(
    (role: UserRoleEnum) => {
      if (!isAuthenticated || !userRole) return false;
      return userRole === role.toString();
    },
    [isAuthenticated, userRole]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      if (!isAuthenticated || !userRole) return false;

      return permissions.every((perm) => {
        const roleHierarchy: { [key: string]: number } = {
          admin: 3,
          manager: 2,
          user: 1,
          candidate: 1,
        };

        const currentRoleLevel = roleHierarchy[userRole] || 0;
        const requiredRoleLevel = roleHierarchy[perm] || 0;

        return currentRoleLevel >= requiredRoleLevel;
      });
    },
    [isAuthenticated, userRole]
  );
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    isAdmin,
    isManager,
    isUser,
    userEmail,
    userFullName,

    login,
    register,
    logout,
    initializeAuth,
    updateUser,
    clearAuthError,

    hasPermission,
    hasRole,
    hasAllPermissions,
    canAccessAdmin,
    canAccessManager,
  };
};
