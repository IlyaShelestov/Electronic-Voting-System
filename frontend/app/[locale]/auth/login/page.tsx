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
export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations("login");
  const dispatch = useAppDispatch();

  const handleOnSubmit = async (loginData: ILogin) => {
    dispatch(setLoading({ key: "auth", value: true }));

    try {
      await authService.login(loginData.iin, loginData.password);
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
        {t("Do you have an account?")}{" "}
        <Link href={`/${locale}/auth/register`}>{t("Register")}</Link>
      </p>
    </>
  );
}
