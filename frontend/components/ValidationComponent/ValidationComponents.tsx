import "./ValidationComponents.scss";

import React from "react";

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div className={`validation-error-message ${className}`}>
      <svg
        className="error-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="16"
        height="16"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

interface FormErrorsProps {
  errors: Array<{ field: string; message: string }>;
  className?: string;
}

export const FormErrors: React.FC<FormErrorsProps> = ({
  errors,
  className = "",
}) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className={`validation-form-errors ${className}`}>
      <div className="errors-header">
        <svg
          className="error-icon-large"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h3>Please fix the following errors:</h3>
      </div>
      <ul className="errors-list">
        {errors.map((error, index) => (
          <li
            key={index}
            className="error-item"
          >
            <span className="field-name">
              {error.field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              :
            </span>
            <span className="error-text">{error.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
