"use client";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { IUser } from "@/models/IUser";
import { authService } from "@/services/authService";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("register");

  const handleOnSubmit = async (registerData: IUser & { password: string }) => {
    try {
      const response = await authService.register(registerData);
      console.log("Registration successful:", response);

      setTimeout(() => router.push(`/${locale}/auth/login`), 1000);
    } catch (err: any) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      <RegisterForm onSubmit={handleOnSubmit} />
      <p className="text-center">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="text-blue-500"
        >
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
