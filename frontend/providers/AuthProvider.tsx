"use client";
import { setLoading } from "@/store/slices/loadingSlice";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { UserService } from "@/services/userService";
import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/utils/tokenHelper";
import { useLocale } from "next-intl";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading({ key: "auth", value: true }));

      const token = getAuthToken();

      if (token && !isTokenExpired(token)) {
        try {
          const user = await UserService.getUser();
          if (user) {
            dispatch(login(user));
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        } finally {
          dispatch(setLoading({ key: "auth", value: false }));
        }
      }
    };

    const handleLogout = () => {
      removeAuthToken();
      dispatch(logout());
      router.push("/");
    };

    initializeAuth();
  }, [dispatch, pathname, router]);

  return (
    <>
    {children}
    </>
  );
};
