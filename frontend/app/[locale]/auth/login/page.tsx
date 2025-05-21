"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/authService";
import { useLocale } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const locale = useLocale();
  const handleOnSubmit = async (loginData: ILogin) => {
    try {
      const auth = await authService.login(loginData.iin, loginData.password);
      router.push(`/${locale}/`);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Войдите в аккаунт</h1>
      <LoginForm onSubmit={handleOnSubmit} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        У вас нет аккаунта?{" "}
        <Link href={`/${locale}/auth/register`}>Зарегистрироваться</Link>{" "}
      </p>
    </>
  );
}
