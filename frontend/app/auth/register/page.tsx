"use client";
import "./Register.scss";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import OtpModal from "@/components/OtpModal/OtpModal";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { IUser } from "@/models/IUser";
import { OtpService } from "@/services/otpService";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("registrationPage");

  const { register, isLoading, error, clearAuthError } = useAuth();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<
    (IUser & { password: string }) | null
  >(null);
  const [email, setEmail] = useState("");

  const handleOnSubmit = async (registerData: IUser & { password: string }) => {
    try {
      clearAuthError();
      await OtpService.sendOtp(registerData.email);
      setEmail(registerData.email);
      setPendingUserData(registerData);
      setIsOtpModalOpen(true);
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
    }
  };
  const handleOtpSubmit = async (otp: string) => {
    if (!pendingUserData) return;

    try {
      const registrationData = { ...pendingUserData, otp };
      await register(registrationData);

      // The register function now handles success toast
      setIsOtpModalOpen(false);
      setPendingUserData(null);
      setTimeout(() => router.push(`/auth/login`), 1000);
    } catch (err: any) {
      // The register function now handles error toast
      console.error("Registration error:", err);
    } finally {
      setIsOtpModalOpen(false);
    }
  };
  return (
    <div className="register-container">
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      <RegisterForm onSubmit={handleOnSubmit} />
      <p className="text-center">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href={`/auth/login`}
          className="text-blue-500"
        >
          {t("login")}
        </Link>
      </p>
      {isLoading && <div className="loading-indicator">Registering...</div>}
      <OtpModal
        email={email}
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmit={handleOtpSubmit}
      />
    </div>
  );
}
