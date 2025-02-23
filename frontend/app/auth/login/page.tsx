"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/authService";
import {userService} from "@/services/userService";
import {useAppDispatch} from "@/store/hooks";
import {login} from "@/store/slices/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  const handleOnSubmit = async (loginData: ILogin) => {
    console.log("Login form submitted", loginData);

    try {
      const auth = await authService.login(loginData.iin, loginData.password);

      if (!auth) {
        setError("Вы уже вошли в систему.");
        return;
      }

      const user = await userService.getUser();
      if (user) {
        dispatch(login(user));
      }

      router.push("/");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Вы уже вошли в систему.");
      } else {
        setError("Неверные учетные данные.");
      }
    }
  };

  return (
      <div className="login-container">
        <h1 className="text-3xl font-bold text-center">Войдите в аккаунт</h1>
        <LoginForm onSubmit={handleOnSubmit} />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <p className="text-center">
          У вас нет аккаунта?{" "}
          <Link href="/auth/register" className="text-blue-500">
            Зарегистрироваться
          </Link>
        </p>
      </div>
  );
}
