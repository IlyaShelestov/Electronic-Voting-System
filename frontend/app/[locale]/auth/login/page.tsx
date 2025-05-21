"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useLocale, useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("login");
  const handleOnSubmit = async (loginData: ILogin) => {
    try {
      const auth = await authService.login(loginData.iin, loginData.password);
      router.push(`/${locale}/`);
    } catch (err) {}
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
