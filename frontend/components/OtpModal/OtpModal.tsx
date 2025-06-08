"use client";
import './OtpModal.scss';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

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
  const [otp, setOtp] = useState("");
  const t = useTranslations("otpModal");

  const handleSubmit = () => {
    onSubmit(otp);
    setOtp("");
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal">
      <div className="otp-modal__content">
        <h2>{t("title")}</h2>
        <p>{t("description", { email: email })}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={t("placeholder")}
        />
        <div>
          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            {t("submit")}
          </button>
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
