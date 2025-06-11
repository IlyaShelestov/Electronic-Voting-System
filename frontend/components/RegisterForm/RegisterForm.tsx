"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import {
  ErrorMessage,
  FormErrors,
} from "@/components/ValidationComponent/ValidationComponents";
import { useFormValidation } from "@/hooks/useFormValidation";
import { ICity } from "@/models/ICity";
import { IUser } from "@/models/IUser";
import { UserRoleEnum } from "@/models/UserRole";
import { LocationsService } from "@/services/locationsService";
import { RegisterFormData, registerSchema } from "@/utils/validationSchemas";

import { ValidatedInput } from "../ValidateIdnput/ValidatedInput";

interface RegisterFormProps {
  onSubmit: (userData: IUser & { password: string }) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [cities, setCities] = useState<ICity[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    iin: "",
    first_name: "",
    last_name: "",
    patronymic: "",
    date_of_birth: "",
    city_id: 0,
    phone_number: "",
    email: "",
    password: "",
    role: UserRoleEnum.USER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validate, getFieldError, validateField, errors } =
    useFormValidation(registerSchema);

  const t = useTranslations("auth");

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await LocationsService.getCities();
      setCities(citiesData);
      if (citiesData.length > 0) {
        setFormData((prev) => ({ ...prev, city_id: citiesData[0].city_id }));
      }
    };

    fetchCities();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "city_id") {
      const cityId = parseInt(value);
      setFormData((prev) => ({ ...prev, city_id: cityId }));
      validateField("city_id", cityId);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name as keyof RegisterFormData, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validate(formData);
    if (isValid) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }

    setIsSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormErrors errors={errors} />

      <div className="form-group">
        <ValidatedInput
          name="iin"
          placeholder={t("iinPlaceholder") || "Enter IIN"}
          value={formData.iin}
          onChange={handleChange}
          error={getFieldError("iin")}
          disabled={isSubmitting}
          required
          label={t("iin") || "IIN"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="first_name"
          placeholder={t("firstNamePlaceholder") || "Enter first name"}
          value={formData.first_name}
          onChange={handleChange}
          error={getFieldError("first_name")}
          disabled={isSubmitting}
          required
          label={t("firstName") || "First Name"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="last_name"
          placeholder={t("lastNamePlaceholder") || "Enter last name"}
          value={formData.last_name}
          onChange={handleChange}
          error={getFieldError("last_name")}
          disabled={isSubmitting}
          required
          label={t("lastName") || "Last Name"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="patronymic"
          placeholder={t("patronymicPlaceholder") || "Enter patronymic"}
          value={formData.patronymic || ""}
          onChange={handleChange}
          error={getFieldError("patronymic")}
          disabled={isSubmitting}
          required
          label={t("patronymic") || "Patronymic"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="date_of_birth"
          type="date"
          placeholder={t("dateOfBirthPlaceholder") || "Select date of birth"}
          value={formData.date_of_birth}
          onChange={handleChange}
          error={getFieldError("date_of_birth")}
          disabled={isSubmitting}
          required
          label={t("dateOfBirth") || "Date of Birth"}
        />
      </div>

      <div className="form-group">
        <label htmlFor="city_id">{t("city")}</label>
        <select
          name="city_id"
          value={formData.city_id}
          onChange={handleChange}
          className={getFieldError("city_id") ? "error" : ""}
          disabled={isSubmitting}
        >
          <option value={0}>{t("selectCity") || "Select a city"}</option>
          {cities.map((city) => (
            <option
              key={city.city_id}
              value={city.city_id}
            >
              {city.name}
            </option>
          ))}
        </select>
        <ErrorMessage message={getFieldError("city_id")} />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="phone_number"
          placeholder={t("phoneNumberPlaceholder") || "Enter phone number"}
          value={formData.phone_number}
          onChange={handleChange}
          error={getFieldError("phone_number")}
          disabled={isSubmitting}
          required
          label={t("phoneNumber") || "Phone Number"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="email"
          type="email"
          placeholder={t("emailPlaceholder") || "Enter email"}
          value={formData.email}
          onChange={handleChange}
          error={getFieldError("email")}
          disabled={isSubmitting}
          required
          label={t("email") || "Email"}
        />
      </div>

      <div className="form-group">
        <ValidatedInput
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder") || "Enter password"}
          value={formData.password}
          onChange={handleChange}
          error={getFieldError("password")}
          disabled={isSubmitting}
          required
          showPasswordStrength={true}
          label={t("password") || "Password"}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("registering") || "Registering..." : t("register")}
      </button>
    </form>
  );
};

export default RegisterForm;
