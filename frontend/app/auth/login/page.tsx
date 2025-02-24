"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import { ILogin } from "@/models/ILogin";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";

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
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError(err.response.data.message || "Неверные учетные данные.");
            break;
          case 403:
            setError("Вы уже вошли в систему.");
            break;
          case 500:
            setError("Ошибка сервера. Попробуйте позже.");
            break;
          default:
            setError("Произошла неизвестная ошибка.");
        }
      } else {
        setError("Ошибка сети. Проверьте подключение к интернету.");
      }
    }
  };

  return (
      <div className="login-container">
        <h1 className="text-3xl font-bold text-center">Войдите в аккаунт</h1>
        <LoginForm onSubmit={handleOnSubmit} />
        <p className="text-center">
          У вас нет аккаунта?{" "}
          <Link href="/auth/register" className="text-blue-500">
            Зарегистрироваться
          </Link>
        </p>
      </div>
  );
}
