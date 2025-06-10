"use client";
import "./UserUpdateModal.scss";

import { useState } from "react";

import { ErrorMessage, FormErrors } from "@/components/ValidationComponent/ValidationComponents";
import { useFormValidation } from "@/hooks/useFormValidation";
import { IUser } from "@/models/IUser";
import { UserRoleEnum } from "@/models/UserRole";
import {
  UserUpdateFormData,
  userUpdateSchema,
} from "@/utils/validationSchemas";

interface UserUpdateModalProps {
  user: IUser;
  onClose: () => void;
  onSave: (user: IUser) => void;
}

export default function UserUpdateModal({
  user,
  onClose,
  onSave,
}: UserUpdateModalProps) {
  const [formData, setFormData] = useState<UserUpdateFormData>({
    iin: user.iin || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    patronymic: user.patronymic || "",
    date_of_birth: user.date_of_birth || "",
    city_id: user.city_id || 0,
    phone_number: user.phone_number || "",
    email: user.email || "",
    role: user.role || UserRoleEnum.USER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validate, getFieldError, validateField, errors } =
    useFormValidation(userUpdateSchema);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "city_id") {
      processedValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    validateField(name as keyof UserUpdateFormData, processedValue);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof UserUpdateFormData, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isValid = validate(formData);
    if (isValid) {
      // Convert back to IUser format
      const userData: IUser = {
        ...formData,
        role: formData.role as UserRoleEnum,
      };
      onSave(userData);
    }

    setIsSubmitting(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal"
      onClick={handleOutsideClick}
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={onClose}
        >
          &times;
        </span>{" "}
        <h2>Update User</h2>
        <FormErrors errors={errors} />
        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData?.first_name || ""}
              onChange={handleInputChange}
              className={getFieldError("first_name") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("first_name")} />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData?.last_name || ""}
              onChange={handleInputChange}
              className={getFieldError("last_name") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("last_name")} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleInputChange}
              className={getFieldError("email") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("email")} />
          </div>
          <div className="form-group">
            <label htmlFor="iin">IIN</label>
            <input
              type="text"
              id="iin"
              name="iin"
              value={formData?.iin || ""}
              onChange={handleInputChange}
              className={getFieldError("iin") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("iin")} />
          </div>
          <div className="form-group">
            <label htmlFor="patronymic">Patronymic</label>
            <input
              type="text"
              id="patronymic"
              name="patronymic"
              value={formData?.patronymic || ""}
              onChange={handleInputChange}
              className={getFieldError("patronymic") ? "error" : ""}
              disabled={isSubmitting}
            />
            <ErrorMessage message={getFieldError("patronymic")} />
          </div>
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData?.date_of_birth || ""}
              onChange={handleInputChange}
              className={getFieldError("date_of_birth") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("date_of_birth")} />
          </div>
          <div className="form-group">
            <label htmlFor="city_id">City ID</label>
            <input
              type="number"
              id="city_id"
              name="city_id"
              value={formData?.city_id || ""}
              onChange={handleInputChange}
              className={getFieldError("city_id") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("city_id")} />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData?.phone_number || ""}
              onChange={handleInputChange}
              className={getFieldError("phone_number") ? "error" : ""}
              disabled={isSubmitting}
              required
            />
            <ErrorMessage message={getFieldError("phone_number")} />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData?.role || UserRoleEnum.USER}
              onChange={handleSelectChange}
              className={getFieldError("role") ? "error" : ""}
              disabled={isSubmitting}
            >
              <option value={UserRoleEnum.USER}>User</option>
              <option value={UserRoleEnum.ADMIN}>Admin</option>
              <option value={UserRoleEnum.MANAGER}>Manager</option>
              <option value={UserRoleEnum.CANDIDATE}>Candidate</option>
            </select>
            <ErrorMessage message={getFieldError("role")} />
          </div>
          <div className="form-group full-width">
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
