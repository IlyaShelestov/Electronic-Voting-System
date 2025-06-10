"use client";

import "./Login.scss";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import LoginForm from "@/components/LoginForm/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { ILogin } from "@/models/ILogin";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("loginPage");
  const auth = useTranslations("auth");

  const { login, isLoading, error, clearAuthError } = useAuth();

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleOnSubmit = async (loginData: ILogin) => {
    try {
      await login(loginData);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      <LoginForm onSubmit={handleOnSubmit} />
      <p>
        {auth("alreadyHaveAccount")}{" "}
        <Link href={`/auth/register`}>{auth("register")}</Link>
      </p>
      {isLoading && <div className="loading-indicator">Logging in...</div>}
    </>
  );
}
