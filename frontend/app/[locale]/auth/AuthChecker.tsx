"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/utils/tokenHelper";

const AuthChecker = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const user = await userService.getUser();
        if (user) {
          dispatch(login(user));
        } else {
          performLogout();
        }
      } catch (error) {
        performLogout();
      }
    };

    const performLogout = () => {
      removeAuthToken();
      dispatch(logout());
      router.replace("/ru/auth/login");
    };

    validateSession();
  }, [dispatch, router]);

  return null;
};

export default AuthChecker;
