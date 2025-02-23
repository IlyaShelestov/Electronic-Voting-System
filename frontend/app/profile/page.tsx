"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { IUser } from "@/models/IUser";
import "./Profile.scss";
import { FaUserCircle } from "react-icons/fa";

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
            <div className="profile-card">
              <div className="profile-header">
                <FaUserCircle className="profile-avatar" />
                <div>
                  <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                  <span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span>
                </div>
              </div>

              <div className="profile-details">

                <div className="profile-row">
                  <strong>Фамилия:</strong> <span>{user.last_name}</span>
                </div>
                <div className="profile-row">
                  <strong>Имя:</strong> <span>{user.first_name}</span>
                </div>
                <div className="profile-row">
                  <strong>Отчество:</strong> <span>{user.patronymic || "----"}</span>
                </div>
                <div className="profile-row">
                  <strong>Дата рождения:</strong> <span>{user.date_of_birth}</span>
                </div>
                <div className="profile-row">
                  <strong>Регион:</strong> <span>{user.region}</span>
                </div>
                <div className="profile-row">
                  <strong>Город:</strong> <span>{user.city}</span>
                </div>
                <div className="profile-row">
                  <strong>ИИН:</strong> <span>{user.iin}</span>
                </div>
                <div className="profile-row">
                  <strong>Телефон:</strong> <span>{user.phone_number}</span>
                </div>
                <div className="profile-row">
                  <strong>Email:</strong> <span>{user.email}</span>
                </div>
              </div>
            </div>
        ) : (
            <div className="loading">Загрузка данных...</div>
        )}
      </div>
  );
}
