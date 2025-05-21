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

  const t = useTranslations("login");

  const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ iin: username, password });
  };

  return (
    <form onSubmit={onSubmitHandle}>
      <div className="form-group">
        <label htmlFor="username">{t("IIN")}</label>
        <input
          type="text"
          name="username"
          placeholder={t("Your IIN")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t("Password")}</label>
        <input
          type="password"
          name="password"
          placeholder={t("Your password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link href="/forgot">{t("Forgot password?")}</Link>
      </div>

      <button type="submit">{t("Login")}</button>
    </form>
  );
};

export default LoginForm;
