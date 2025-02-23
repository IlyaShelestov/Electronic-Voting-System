"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import { userService } from "@/services/userService";

const AuthChecker = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await userService.getUser();

        if (user) {
          dispatch(login(user));
        } else {

        }
      } catch (error) {
        console.error("User not authenticated", error);
      }
    };

    checkLogin();
  }, [dispatch]);

  return null;
};

export default AuthChecker;
