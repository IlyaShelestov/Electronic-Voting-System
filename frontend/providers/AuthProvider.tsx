"use client";
import { ReactNode, useEffect } from "react";

import { useAuthRedux } from "@/store/hooks/useAuthRedux";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { initializeAuth } = useAuthRedux();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };

    initAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};
