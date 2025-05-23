"use client";

import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import React from 'react';
import { setLoading } from "@/store/slices/loadingSlice";
import { useAppDispatch } from "@/store/hooks";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations("loginPage");
  const auth = useTranslations("auth");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleOnSubmit = async (loginData: ILogin) => {
    dispatch(setLoading({ key: "auth", value: true }));

    try {
      await authService.login(loginData.iin, loginData.password).then((res) => {
          router.refresh();
      });
    } catch (err) {
      console.error('Network error', err);
    } finally {
      dispatch(setLoading({ key: "auth", value: false }));
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      <LoginForm onSubmit={handleOnSubmit} />
      <p>
        {auth("alreadyHaveAccount")}{" "}
        <Link href={`/${locale}/auth/register`}>{auth("register")}</Link>
      </p>
    </>
  );
}
