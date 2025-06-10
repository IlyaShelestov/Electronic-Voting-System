"use client";

import { useAuthRedux } from "@/store/hooks/useAuthRedux";

export const useAuth = () => {
  const {
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
    canAccessAdmin,
    canAccessManager,
  } = useAuthRedux();

  const refetch = async () => {
    await initializeAuth();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,

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
    canAccessAdmin,
    canAccessManager,
  };
};
