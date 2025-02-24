"use client";
import { useState } from "react";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { IUser } from "@/models/IUser";
import { authService } from "@/services/authService"; // ✅ Import API service
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleOnSubmit = async (registerData: IUser & { password: string }) => {
        try {
            setError(null);
            setSuccess(null);

            const response = await authService.register(registerData);
            console.log("Registration successful:", response);

            setSuccess("Регистрация прошла успешно! Перенаправление...");
            setTimeout(() => router.push("/auth/login"), 2000); // Redirect after success
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || "Ошибка при регистрации");
        }
    };

    return (
        <div className="register-container">
            <h1 className="text-3xl font-bold text-center">Регистрация</h1>
            <RegisterForm onSubmit={handleOnSubmit} />
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <p className="text-center">
                У вас уже есть аккаунт? <Link href="/auth/login" className="text-blue-500">Войти</Link>
            </p>
        </div>
    );
}
