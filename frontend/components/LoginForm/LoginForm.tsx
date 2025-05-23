"use client";

import React, { useState } from "react";
import { ILogin } from "@/models/ILogin";
import Link from "next/link";

import "./LoginForm.scss";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onSubmit: (loginData: ILogin) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("auth");

  const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ iin: username, password });
  };

  return (
    <form onSubmit={onSubmitHandle}>
      <div className="form-group">
        <label htmlFor="username">{t("iin")}</label>
        <input
          type="text"
          name="username"
          placeholder={t("iinPlaceholder")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t("password")}</label>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link href="/forgot">{t("forgotPassword")}</Link>
      </div>

      <button type="submit">{t("login")}</button>
    </form>
  );
};

export default LoginForm;
