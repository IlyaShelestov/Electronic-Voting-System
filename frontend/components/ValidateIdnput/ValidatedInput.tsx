import "./ValidatedInput.scss";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import {
  formatInput,
  getAriaDescribedBy,
  getAriaInvalid,
  getInputState,
  getPasswordStrength,
} from "@/utils/validationHelpers";

import { ErrorMessage } from "../ValidationComponent/ValidationComponents";

interface ValidatedInputProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | null;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  showPasswordStrength?: boolean;
  formatOnChange?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  autoComplete,
  showPasswordStrength = false,
  formatOnChange = true,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations();

  const inputState = getInputState(focused, value, error ?? null, false);
  const passwordStrength =
    showPasswordStrength && type === "password" && value
      ? getPasswordStrength(value)
      : null;

  // Translate error message if it's a translation key
  const translatedError =
    error && error.startsWith("validation.") ? t(error) : error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formatOnChange) {
      const formattedValue = formatInput(name, e.target.value);
      e.target.value = formattedValue;
    }
    onChange(e);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`validated-input ${className}`}>
      <label
        htmlFor={name}
        className="validated-input__label"
      >
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div
        className={`validated-input__container validated-input__container--${inputState}`}
      >
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`validated-input__field ${
            translatedError ? "validated-input__field--error" : ""
          }`}
          aria-invalid={getAriaInvalid(!!translatedError)}
          aria-describedby={getAriaDescribedBy(name, !!translatedError)}
        />

        {type === "password" && value && (
          <button
            type="button"
            className="validated-input__password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={
              showPassword ? t("common.hidePassword") : t("common.showPassword")
            }
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line
                  x1="1"
                  y1="1"
                  x2="23"
                  y2="23"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>
            )}
          </button>
        )}

        {inputState === "valid" && !translatedError && value && (
          <div className="validated-input__success-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
        )}
      </div>

      {passwordStrength && (
        <div className="password-strength">
          <div className="password-strength__bar">
            <div
              className={`password-strength__fill password-strength__fill--${passwordStrength.strength}`}
              style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
            />
          </div>
          <div className="password-strength__text">
            {t("validation.passwordStrength")}:{" "}
            <span className={`strength-${passwordStrength.strength}`}>
              {t(`validation.strength.${passwordStrength.strength}`)}
            </span>
          </div>
          {passwordStrength.feedback.length > 0 && (
            <ul className="password-strength__feedback">
              {passwordStrength.feedback.map((feedback, index) => (
                <li key={index}>{feedback}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ErrorMessage message={translatedError} />
    </div>
  );
};
