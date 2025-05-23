"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";
import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/utils/tokenHelper";
import { useLocale } from "next-intl";

interface AuthContextType {
  loading: boolean;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  authenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();

      if (token && !isTokenExpired(token)) {
        try {
          const user = await userService.getUser();
          if (user) {
            dispatch(login(user));
            setAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    };

    const handleLogout = () => {
      removeAuthToken();
      dispatch(logout());
      setAuthenticated(false);
      if (pathname !== `/${locale}/`) {
        router.replace(`/${locale}/`);
      }
    };

    initializeAuth();
  }, [dispatch, pathname, locale, router]);

  return (
    <AuthContext.Provider value={{ loading, authenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
