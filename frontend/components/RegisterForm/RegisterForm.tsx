"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { ErrorMessage, FormErrors } from "@/components/ui/ValidationComponents";
import { useFormValidation } from "@/hooks/useFormValidation";
import { ICity } from "@/models/ICity";
import { IUser } from "@/models/IUser";
import { LocationsService } from "@/services/locationsService";
import { RegisterFormData, registerSchema } from "@/utils/validationSchemas";

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
      <div className="form-group">
        <label htmlFor="iin">{t("iin")}</label>
        <input
          type="text"
          name="iin"
          placeholder={t("iin")}
          value={formData.iin}
          onChange={handleChange}
          className={getFieldError("iin") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("iin")} />
      </div>

      <div className="form-group">
        <label htmlFor="first_name">{t("firstName")}</label>
        <input
          type="text"
          name="first_name"
          placeholder={t("firstName")}
          value={formData.first_name}
          onChange={handleChange}
          className={getFieldError("first_name") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("first_name")} />
      </div>

      <div className="form-group">
        <label htmlFor="last_name">{t("lastName")}</label>
        <input
          type="text"
          name="last_name"
          placeholder={t("lastName")}
          value={formData.last_name}
          onChange={handleChange}
          className={getFieldError("last_name") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("last_name")} />
      </div>

      <div className="form-group">
        <label htmlFor="patronymic">{t("patronymic")}</label>
        <input
          type="text"
          name="patronymic"
          placeholder={t("patronymic")}
          value={formData.patronymic || ""}
          onChange={handleChange}
          className={getFieldError("patronymic") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("patronymic")} />
      </div>

      <div className="form-group">
        <label htmlFor="date_of_birth">{t("dateOfBirth")}</label>
        <input
          type="date"
          name="date_of_birth"
          placeholder={t("dateOfBirth")}
          value={formData.date_of_birth}
          onChange={handleChange}
          className={getFieldError("date_of_birth") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("date_of_birth")} />
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
        <label htmlFor="phone_number">{t("phoneNumber")}</label>
        <input
          type="text"
          name="phone_number"
          placeholder={t("phoneNumber")}
          value={formData.phone_number}
          onChange={handleChange}
          className={getFieldError("phone_number") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("phone_number")} />
      </div>

      <div className="form-group">
        <label htmlFor="email">{t("email")}</label>
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={handleChange}
          className={getFieldError("email") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("email")} />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t("password")}</label>
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          value={formData.password}
          onChange={handleChange}
          className={getFieldError("password") ? "error" : ""}
          disabled={isSubmitting}
        />
        <ErrorMessage message={getFieldError("password")} />
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
