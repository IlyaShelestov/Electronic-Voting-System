"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/authService";
import { IUser } from "@/models/IUser";
import { userService } from "@/services/userService";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const handleOnSubmit = async (loginData: ILogin) => {
    console.log("Login form submitted", loginData);

    try {
      const auth: { token: String } = await authService.login(
        loginData.iin,
        loginData.password
      );

      document.cookie = `token=${auth.token}; path=/; Secure; SameSite=Strict;`;

      const user: IUser = await userService.getUser();

      dispatch(login(user));

      router.push("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Войдите в аккаунт</h1>
      <LoginForm onSubmit={handleOnSubmit} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        У вас нет аккаунта?{" "}
        <Link href="/auth/register">Зарегистрироваться</Link>{" "}
      </p>
    </>
  );
}
