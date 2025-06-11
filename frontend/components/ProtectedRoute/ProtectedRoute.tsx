"use client";

import { redirect } from "next/navigation";
import * as React from "react";

import { UserRoleEnum } from "@/models/UserRole";
import { useAuthRedux } from "@/store/hooks/useAuthRedux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRoleEnum;
  fallbackUrl?: string;
  showLoading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackUrl = "/auth/login",
  showLoading = true,
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuthRedux();

  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect(fallbackUrl);
  }

  if (requiredRole && !hasRole(requiredRole)) {
    redirect("/auth/login");
  }

  return <>{children}</>;
};

// Higher-order component for easier usage
export const withProtectedRoute = (
  Component: React.ComponentType,
  options?: Omit<ProtectedRouteProps, "children">
) => {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={UserRoleEnum.ADMIN}>{children}</ProtectedRoute>
);

export const ManagerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={UserRoleEnum.MANAGER}>
    {children}
  </ProtectedRoute>
);
export const UserProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={UserRoleEnum.USER}>{children}</ProtectedRoute>
);
