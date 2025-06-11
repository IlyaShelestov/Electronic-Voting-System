"use client";
import "./OtpModal.scss";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  email: string;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  email,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const t = useTranslations("otpModal");
  const vt = useTranslations("validation");

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error when user types

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(vt("otpIncomplete"));
      return;
    }

    if (!/^\d{6}$/.test(otpString)) {
      setError(vt("otpDigitsOnly"));
      return;
    }

    onSubmit(otpString);
    setOtp(Array(6).fill(""));
    setError("");
  };

  const handleClose = () => {
    setOtp(Array(6).fill(""));
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal">
      <div className="otp-modal__content">
        <h2>{t("title")}</h2>
        <p>{t("description", { email: email })}</p>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`otp-digit ${error ? "error" : ""}`}
              maxLength={1}
              placeholder="0"
            />
          ))}
        </div>
        {error && <div className="otp-error">{error}</div>}
        <div>
          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            {t("submit")}
          </button>
          <button
            className="cancel-btn"
            onClick={handleClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
