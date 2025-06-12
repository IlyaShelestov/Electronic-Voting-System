"use client";

import "./ResetPasswordForm.scss";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { ValidatedInput } from "@/components/ValidateIdnput/ValidatedInput";

interface ResetPasswordFormProps {
  email: string;
  onSubmit: (data: { otp: string; newPassword: string }) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  onSubmit,
  isLoading = false,
  onBack,
}) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const t = useTranslations("forgotPasswordPage");
  const auth = useTranslations("auth");

  const validateOtp = (value: string) => {
    if (!value) {
      return "OTP is required";
    }
    if (value.length !== 6) {
      return "OTP must be 6 digits";
    }
    if (!/^\d+$/.test(value)) {
      return "OTP must contain only numbers";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 9) {
      return "Password must be at least 9 characters";
    }
    if (!/[A-Za-z]/.test(value)) {
      return "Password must contain at least one letter";
    }
    if (!/\d/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/[@$!%*?&]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    setOtpError(validateOtp(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValidationError = validateOtp(otp);
    const passwordValidationError = validatePassword(newPassword);

    setOtpError(otpValidationError);
    setPasswordError(passwordValidationError);

    if (!otpValidationError && !passwordValidationError) {
      onSubmit({ otp, newPassword });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="reset-password-form"
    >
      <div className="form-group">
        <label htmlFor="email">{auth("email")}</label>
        <input
          type="email"
          id="email"
          value={email}
          disabled
          className="disabled-input"
        />
      </div>{" "}
      <div className="form-group">
        <ValidatedInput
          type="text"
          name="otp"
          label={t("otpPlaceholder")}
          placeholder={t("otpPlaceholder")}
          value={otp}
          onChange={handleOtpChange}
          error={otpError}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <ValidatedInput
          type="password"
          name="newPassword"
          label={t("newPasswordPlaceholder")}
          placeholder={t("newPasswordPlaceholder")}
          value={newPassword}
          onChange={handlePasswordChange}
          error={passwordError}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-actions">
        {onBack && (
          <button
            type="button"
            className="back-button"
            onClick={onBack}
            disabled={isLoading}
          >
            {t("backToEmail")}
          </button>
        )}

        <button
          type="submit"
          className={`submit-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner" />
              {t("resetting")}
            </>
          ) : (
            t("resetPassword")
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
