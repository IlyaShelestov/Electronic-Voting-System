"use client";

import "./ForgotPassword.scss";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";

import ForgotPasswordForm from "@/components/ForgotPasswordForm/ForgotPasswordForm";
import ResetPasswordForm from "@/components/ResetPasswordForm/ResetPasswordForm";
import { AuthService } from "@/services/authService";
import { OtpService } from "@/services/otpService";

type Step = "email" | "reset" | "success";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPasswordPage");
  const auth = useTranslations("auth");
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await OtpService.sendOtp(data.email);
      setEmail(data.email);
      setCurrentStep("reset");
    } catch (error: any) {
      console.error("Send OTP error:", error);
      setError(error.response?.data?.message || t("errorSendingOtp"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: {
    otp: string;
    newPassword: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword(email, data.otp, data.newPassword);
      setCurrentStep("success");
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(error.response?.data?.message || t("errorResettingPassword"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setError(null);
  };

  if (currentStep === "success") {
    return (
      <div className="forgot-password-success">
        <h1 className="text-3xl font-bold text-center text-green-600">
          {t("passwordResetSuccess")}
        </h1>
        <p className="text-center mt-4 mb-6">
          {t("passwordResetSuccessDescription")}
        </p>
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>{t("title")}</h1>

      {currentStep === "email" && (
        <>
          <p className="text-center text-gray-600 mb-6">{t("description")}</p>

          {error && (
            <div className="error-message bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <ForgotPasswordForm
            onSubmit={handleSendOtp}
            isLoading={isLoading}
          />

          <div className="text-center mt-6">
            <p>
              {t("rememberPassword")}{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {auth("login")}
              </Link>
            </p>
          </div>
        </>
      )}

      {currentStep === "reset" && (
        <>
          <p className="text-center text-gray-600 mb-6">
            {t("otpSentDescription", { email })}
          </p>

          {error && (
            <div className="error-message bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <ResetPasswordForm
            email={email}
            onSubmit={handleResetPassword}
            isLoading={isLoading}
            onBack={handleBackToEmail}
          />
        </>
      )}
    </>
  );
}
