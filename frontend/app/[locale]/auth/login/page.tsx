"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from 'react';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations("login");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (loginData: ILogin) => {
    setIsLoading(true);
    try {
      const response = await authService.login(loginData.iin, loginData.password);
      
    } catch (err) {
      console.error('Network error', err);
    } finally {
      setIsLoading(false);
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
      {isLoading && <div>Loading...</div>}
    </>
  );
}
