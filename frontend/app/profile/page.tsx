"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { IUser } from "@/models/IUser";
import "./Profile.scss";

export default function ProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-container">
      <h1 className="profile-title">Профиль</h1>
      {user ? (
        <div className="profile-info">
          <p>
            <strong>Фамилия:</strong> {user.last_name}
          </p>
          <p>
            <strong>Имя:</strong> {user.first_name}
          </p>
          <p>
            <strong>Отчество:</strong> {user.patronymic || "—"}
          </p>

          <p>
            <strong>Дата рождения:</strong> {user.date_of_birth}
          </p>
          <p>
            <strong>Город:</strong> {user.city}
          </p>

          <p>
            <strong>ИИН:</strong> {user.iin}
          </p>

          <p>
            <strong>Номер телефона:</strong> {user.phone_number}
          </p>
        </div>
      ) : (
        <p className="loading">Загрузка данных...</p>
      )}
    </div>
  );
}
