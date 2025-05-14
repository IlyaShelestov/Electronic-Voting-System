"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";
import { useRouter } from "next/navigation";

const AuthChecker = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await userService.getUser();

        if (user) {
          dispatch(login(user));
        } else {
          router.replace("/ru/auth/login");
        }
      } catch (error) {
        console.error("User not authenticated", error);
        router.replace("/ru/auth/login");
      }
    };

    checkLogin().catch(console.error);
  }, [dispatch, router]);

  return null;
};

export default AuthChecker;
