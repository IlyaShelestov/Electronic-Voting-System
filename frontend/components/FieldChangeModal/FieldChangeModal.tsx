"use client";

import "./FieldChangeModal.scss";

import { useTranslations } from "next-intl";
import { useState } from "react";

import LoadingButton from "@/components/LoadingButton/LoadingButton";
import { IUser } from "@/models/IUser";
import { UserService } from "@/services/userService";
import { useLoading } from "@/store/hooks/useLoading";

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

  const allowedFields = [
    "phone_number",
    "email",
    "city_id",
    "first_name",
    "last_name",
    "patronymic",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
          if (errorMessage?.includes("Invalid email format")) {
            setError(t("invalidEmailFormat"));
          } else if (errorMessage?.includes("Invalid phone number format")) {
            setError(t("invalidPhoneFormat"));
          } else if (errorMessage?.includes("Invalid first name format")) {
            setError(t("invalidFirstNameFormat"));
          } else if (errorMessage?.includes("Invalid last name format")) {
            setError(t("invalidLastNameFormat"));
          } else if (errorMessage?.includes("Invalid patronymic format")) {
            setError(t("invalidPatronymicFormat"));
          } else if (
            errorMessage?.includes("New value is the same as current value")
          ) {
            setError(t("valueUnchanged"));
          } else {
            setError(errorMessage || t("requestFailed"));
          }
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
          </div>

          <div className="field-group">
            <label htmlFor="new-value">{t("newValue")}*:</label>
            <input
              id="new-value"
              type={getInputType()}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={getPlaceholder()}
              required
            />
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
