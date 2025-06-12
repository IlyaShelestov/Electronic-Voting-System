"use client";

import "./ForgotPasswordForm.scss";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { ValidatedInput } from "@/components/ValidateIdnput/ValidatedInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/utils/validationSchemas";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const { validate, getFieldError, validateField } =
    useFormValidation(forgotPasswordSchema);
  const t = useTranslations("forgotPasswordPage");
  const auth = useTranslations("auth");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof ForgotPasswordFormData, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate(formData);
    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="forgot-password-form"
    >
      <div className="form-group">
        <ValidatedInput
          label={auth("email")}
          type="email"
          name="email"
          placeholder={auth("emailPlaceholder")}
          value={formData.email}
          onChange={handleInputChange}
          error={getFieldError("email")}
          required
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className={`submit-button ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner" />
            {t("sending")}
          </>
        ) : (
          t("sendResetLink")
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
