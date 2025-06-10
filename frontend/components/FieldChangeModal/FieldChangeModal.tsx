"use client";

import "./FieldChangeModal.scss";

import { useTranslations } from "next-intl";
import { useState } from "react";

import LoadingButton from "@/components/LoadingButton/LoadingButton";
import { ErrorMessage } from "@/components/ValidationComponent/ValidationComponents";
import { IUser } from "@/models/IUser";
import { UserService } from "@/services/userService";
import { useLoading } from "@/store/hooks/useLoading";
import { getFieldValidationSchema } from "@/utils/validationSchemas";

interface FieldChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onSuccess: () => void;
}

const FieldChangeModal: React.FC<FieldChangeModalProps> = ({
  isOpen,
  onClose,
  user,
  fieldName,
  fieldLabel,
  currentValue,
  onSuccess,
}) => {
  const t = useTranslations("profile");
  const { isLoading, withLoading } = useLoading();
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const allowedFields = [
    "phone_number",
    "email",
    "city_id",
    "first_name",
    "last_name",
    "patronymic",
  ];

  const validateField = (fieldName: string, value: string): string | null => {
    try {
      const schema = getFieldValidationSchema(fieldName);
      let processedValue: any = value;

      // Convert city_id to number for validation
      if (fieldName === "city_id") {
        processedValue = parseInt(value) || 0;
      }

      schema.parse(processedValue);
      return null;
    } catch (error: any) {
      return error.errors?.[0]?.message || "Invalid value";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewValue(value);

    // Clear previous errors
    setError(null);
    setValidationError(null);

    // Validate on change for immediate feedback
    if (value.trim()) {
      const validationErr = validateField(fieldName, value);
      setValidationError(validationErr);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    if (!newValue.trim()) {
      setError(t("newValueRequired"));
      return;
    }

    if (newValue === currentValue) {
      setError(t("valueUnchanged"));
      return;
    }

    if (!allowedFields.includes(fieldName)) {
      setError(t("fieldNotEditable"));
      return;
    }

    // Validate the field before submission
    const validationErr = validateField(fieldName, newValue);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    await withLoading("sendRequest", async () => {
      try {
        await UserService.sendFieldChangeRequest({
          field_name: fieldName as any,
          new_value: newValue.trim(),
        });

        onSuccess();
        onClose();
        setNewValue("");
      } catch (error: any) {
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.message;
          setError(errorMessage || t("requestFailed"));
        } else if (error.response?.status === 403) {
          setError(t("fieldNotEditable"));
        } else {
          setError(t("requestFailed"));
        }
        console.error("Error sending request:", error);
      }
    });
  };
  const handleClose = () => {
    setNewValue("");
    setError(null);
    setValidationError(null);
    onClose();
  };

  const getInputType = () => {
    switch (fieldName) {
      case "email":
        return "email";
      case "phone_number":
        return "tel";
      case "city_id":
        return "number";
      default:
        return "text";
    }
  };

  const getPlaceholder = () => {
    switch (fieldName) {
      case "email":
        return "example@email.com";
      case "phone_number":
        return "+7XXXXXXXXXX";
      case "city_id":
        return "1";
      case "first_name":
        return t("enterFirstName");
      case "last_name":
        return t("enterLastName");
      case "patronymic":
        return t("enterPatronymic");
      default:
        return t("enterNewValue");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="field-change-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t("changeField", { field: fieldLabel })}</h2>
          <button
            className="close-btn"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="modal-content"
        >
          <div className="field-group">
            <label>{t("currentValue")}:</label>
            <div className="current-value">{currentValue || t("notSet")}</div>
          </div>{" "}
          <div className="field-group">
            <label htmlFor="new-value">{t("newValue")}*:</label>
            <input
              id="new-value"
              type={getInputType()}
              value={newValue}
              onChange={handleInputChange}
              placeholder={getPlaceholder()}
              className={validationError ? "error" : ""}
              required
            />
            <ErrorMessage message={validationError} />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-btn"
            >
              {t("cancel")}
            </button>
            <LoadingButton
              type="submit"
              isLoading={isLoading("sendRequest")}
              variant="primary"
              loadingText={t("sendingRequest")}
            >
              {t("sendRequest")}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldChangeModal;
