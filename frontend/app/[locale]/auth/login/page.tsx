"use client";

import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/loadingSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reduxStore";
import { authService } from "@/services/authService";
import { removeAuthToken } from "@/utils/tokenHelper";
import LoginForm from "@/components/LoginForm/LoginForm";
import LoadingCircle from "@/components/LoadingCircle/LoadingCircle";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("loginPage");
  const auth = useTranslations("auth");

  const isLoading = useAppSelector((state) => state.loading.auth);

  useEffect(() => {
    dispatch(setLoading({ key: "auth", value: false }));
  }, []);

  const mutation = useMutation({
    mutationFn: (loginData: ILogin) =>
      authService.login(loginData.iin, loginData.password),
    onMutate: () => {
      dispatch(setLoading({ key: "auth", value: true }));
    },
    onSuccess: (data) => {
      console.log("Login success:", data);
      // You could route to dashboard here
      router.push(`/${locale}`);
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      let message;
      if (status === 401) {
        removeAuthToken();
        message = t("invalidCredentials");
      } else if (status === 403) {
        message = t("forbiddenAccess");
      } else if (status === 500) {
        message = t("serverError");
      } else {
        message = t("unknownError");
      }
      alert(message); // Optional: Replace with custom toast UI
    },
    onSettled: () => {
      dispatch(setLoading({ key: "auth", value: false }));
    },
  });

  const handleOnSubmit = (loginData: ILogin) => {
    mutation.mutate(loginData);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      {isLoading && <LoadingCircle />}
       <LoginForm onSubmit={handleOnSubmit} />
      <p>
        {auth("alreadyHaveAccount")}{" "}
        <Link href={`/${locale}/auth/register`}>{auth("register")}</Link>
      </p>
    </>
  );
}
