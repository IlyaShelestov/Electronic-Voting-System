"use client";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { IUser } from "@/models/IUser";
import Link from "next/link";

export default function RegisterPage() {
  const handleOnSubmit = (registerData: IUser) => {
    console.log("Register data submitted:", registerData);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Регистрация</h1>
      <RegisterForm onSubmit={handleOnSubmit} />
      <p>
        У вас уже есть аккаунт? <Link href="/auth/login">Войти</Link>
      </p>
    </>
  );
}
