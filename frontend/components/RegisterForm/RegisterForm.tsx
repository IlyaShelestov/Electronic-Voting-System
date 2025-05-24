"use client";

import React, { useEffect, useState } from "react";
import { IUser } from "@/models/IUser";
import { locationsService } from "@/services/locationsService";
import { ICity } from "@/models/ICity";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  onSubmit: (userData: IUser & { password: string }) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [cities, setCities] = useState<ICity[]>([]);
  const [formData, setFormData] = useState<IUser & { password: string }>({
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

  const t = useTranslations("auth");

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await locationsService.getCities();
      console.log(citiesData);
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
      setFormData({ ...formData, city_id: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
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
        />
      </div>
      <div className="form-group">
        <label htmlFor="first_name">{t("firstName")}</label>
        <input
          type="text"
          name="first_name"
          placeholder={t("firstName")}
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">{t("lastName")}</label>
        <input
          type="text"
          name="last_name"
          placeholder={t("lastName")}
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="patronymic">{t("patronymic")}</label>
        <input
          type="text"
          name="patronymic"
          placeholder={t("patronymic")}
          value={formData.patronymic || ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="date_of_birth">{t("dateOfBirth")}</label>
        <input
          type="date"
          name="date_of_birth"
          placeholder={t("dateOfBirth")}
          value={formData.date_of_birth}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="city_id">{t("city")}</label>
        <select
          name="city_id"
          value={formData.city_id}
          onChange={handleChange}
        >
          {cities.map((city) => (
            <option
              key={city.city_id}
              value={city.city_id}
            >
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="phone_number">{t("phoneNumber")}</label>
        <input
          type="text"
          name="phone_number"
          placeholder={t("phoneNumber")}
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">{t("email")}</label>
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">{t("password")}</label>
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">{t("register")}</button>
    </form>
  );
};

export default RegisterForm;
