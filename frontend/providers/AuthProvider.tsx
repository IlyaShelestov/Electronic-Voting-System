"use client";
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { UserService } from '@/services/userService';
import { useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/slices/loadingSlice';
import { login, logout } from '@/store/slices/userSlice';
import { getAuthToken, isTokenExpired, removeAuthToken } from '@/utils/tokenHelper';

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

  return <>{children}</>;
};
