"use client";

import React, { useState } from "react";
import { IUser } from "@/models/IUser";

// City data
const cities = [
  { id: 1, name: "Алматы" },
  { id: 2, name: "Астана" },
  { id: 3, name: "Шымкент" },
  { id: 4, name: "Актобе" },
  { id: 5, name: "Атырау" },
  { id: 6, name: "Актау" },
  { id: 7, name: "Караганда" },
  { id: 8, name: "Павлодар" },
  { id: 9, name: "Петропавловск" },
  { id: 10, name: "Костанай" },
  { id: 11, name: "Уральск" },
  { id: 12, name: "Усть-Каменогорск" },
  { id: 13, name: "Кокшетау" },
  { id: 14, name: "Кызылорда" },
  { id: 15, name: "Тараз" },
  { id: 16, name: "Туркестан" },
];

interface RegisterFormProps {
  onSubmit: (userData: IUser & { password: string }) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<IUser & { password: string }>({
    iin: "",
    first_name: "",
    last_name: "",
    patronymic: "",
    date_of_birth: "",
    region: "",
    city_id: 1, // Initialize with a default value
    phone_number: "",
    email: "",
    role: "user",
    password: "", // Add password field
  });

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
        <label htmlFor="iin">ИИН</label>
        <input
          type="text"
          name="iin"
          placeholder="IIN"
          value={formData.iin}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="first_name">Имя</label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">Фамилия</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="patronymic">Отчество</label>
        <input
          type="text"
          name="patronymic"
          placeholder="Patronymic"
          value={formData.patronymic || ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="date_of_birth">Дата рождения</label>
        <input
          type="date"
          name="date_of_birth"
          placeholder="Date of Birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="region">Область</label>
        <input
          type="text"
          name="region"
          placeholder="Region"
          value={formData.region}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="city_id">Город</label>
        <select
          name="city_id"
          value={formData.city_id}
          onChange={handleChange}
        >
          {cities.map((city) => (
            <option
              key={city.id}
              value={city.id}
            >
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="phone_number">Номер телефона</label>
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterForm;
