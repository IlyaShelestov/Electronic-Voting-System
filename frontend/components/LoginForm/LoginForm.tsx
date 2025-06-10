"use client";

import "./LoginForm.scss";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";

import { ValidatedInput } from "@/components/ValidateIdnput/ValidatedInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import { ILogin } from "@/models/ILogin";
import { LoginFormData, loginSchema } from "@/utils/validationSchemas";

interface LoginFormProps {
  onSubmit: (loginData: ILogin) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    iin: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validate, getFieldError, validateField } =
    useFormValidation(loginSchema);

  const t = useTranslations("auth");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name as keyof LoginFormData, value);
  };

  const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validate(formData);
    if (isValid) {
      onSubmit({ iin: formData.iin, password: formData.password });
    }

    setIsSubmitting(false);
  };
  return (
    <form onSubmit={onSubmitHandle}>
      <div className="form-group">
        <ValidatedInput
          type="text"
          name="iin"
          value={formData.iin}
          onChange={handleInputChange}
          label={t("iin")}
          placeholder={t("iinPlaceholder")}
          error={getFieldError("iin")}
          required
          disabled={isSubmitting}
          autoComplete="username"
          formatOnChange={true}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          label={t("password")}
          placeholder={t("passwordPlaceholder")}
          error={getFieldError("password")}
          required
          disabled={isSubmitting}
          autoComplete="current-password"
        />
        <Link
          href="/forgot"
          className="forgot-password-link"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="login-submit-button"
      >
        {isSubmitting ? t("loggingIn") || "Logging in..." : t("login")}
      </button>
    </form>
  );
};

export default LoginForm;
