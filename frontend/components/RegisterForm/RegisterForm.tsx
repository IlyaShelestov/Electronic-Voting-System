"use client";

import React, { useState } from "react";
import { IUser } from "@/models/IUser";
import "./RegisterForm.scss";

interface RegisterFormProps {
    onSubmit: (userData: IUser & { password: string }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<IUser & { password: string; confirmPassword: string }>({
        iin: "",
        first_name: "",
        last_name: "",
        patronymic: "",
        date_of_birth: "",
        region: "",
        city: "",
        phone_number: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!/^\d{12}$/.test(formData.iin)) {
            newErrors.iin = "ИИН должен содержать 12 цифр";
        }
        if (!formData.first_name.trim()) {
            newErrors.first_name = "Имя обязательно";
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Фамилия обязательна";
        }
        if (!formData.email.includes("@")) {
            newErrors.email = "Некорректный email";
        }
        if (!/^\+7\d{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = "Некорректный номер телефона";
        }
        if (formData.password.length < 6) {
            newErrors.password = "Пароль должен содержать минимум 6 символов";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        if (validateForm()) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...dataToSubmit } = formData;
            onSubmit(dataToSubmit);
            console.log(dataToSubmit);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
                <label htmlFor="iin">ИИН</label>
                <input type="text" name="iin" placeholder="IIN" value={formData.iin} onChange={handleChange} />
                {errors.iin && <p className="error-message">{errors.iin}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="first_name">Имя</label>
                <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="last_name">Фамилия</label>
                <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                {errors.last_name && <p className="error-message">{errors.last_name}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="patronymic">Отчество</label>
                <input type="text" name="patronymic" placeholder="Patronymic" value={formData.patronymic || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="date_of_birth">Дата рождения</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="region">Область</label>
                <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="city">Город</label>
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="phone_number">Номер телефона</label>
                <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={Object.keys(errors).length > 0}>Зарегистрироваться</button>
        </form>
    );
};

export default RegisterForm;
