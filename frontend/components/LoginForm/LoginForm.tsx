"use client";

import React, { useState } from "react";
import { ILogin } from "@/models/ILogin";
import Link from "next/link";

import "./LoginForm.scss";

interface LoginFormProps {
  onSubmit: (loginData: ILogin) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ iin: username, password });
  };

  return (
    <form onSubmit={onSubmitHandle}>
      <div className="form-group">
        <label htmlFor="username">Логин</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link href="./forgot">Забыли пароль?</Link>
      </div>

      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;
