"use client";
import css from "./page.module.css";
import { useState } from "react";
import { register } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiError } from "@/app/api/api";
import Link from "next/link";
import toast from "react-hot-toast"; 

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            const formValues = Object.fromEntries(formData) as unknown as User;
            const result = await register(formValues);
            
            if (result) {
                toast.success("Реєстрація успішна! Тепер ви можете увійти.");
                    router.push("/auth/login");
            } else {
                setError("Реєстрація не вдалася. Спробуйте ще раз.");
                toast.error("Щось пішло не так.");
            }
        } catch (err) {
            const message = (err as ApiError).response?.data?.error ?? (err as ApiError).message ?? "Сталася непередбачувана помилка";
            setError(message);
            toast.error(message);
        }
    }
    
    return (
        <main className={css.mainContent}>
            <div className={css.tabNavigation}>
                <Link href="/auth/register" className={`${css.tabLink} ${css.active}`}>
                    Реєстрація
                </Link>
                <Link href="/auth/login" className={css.tabLink}>
                    Вхід
                </Link>
            </div>
            <div className={css.registerContainer}> 
                
                <h1>Реєстрація</h1>
                <p className={css.subtitle}>
                    Раді вас бачити у спільноті мандрівників!
                </p>

                <form onSubmit={handleSubmit}>
                    <div className={css.formGroup}>
                        <label htmlFor="name">Ім'я та Прізвище*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Ваше ім'я та прізвище"
                            required
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="email">Пошта*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="hello@podorozhnyky.ua"
                            required
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="password">Пароль*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {error && <p className={css.errorMessage}>{error}</p>}

                    <button type="submit" className={css.btnPrimary}>
                        Зареєструватись
                    </button>
                </form>

                <div className={css.formFooter}>
                    Вже маєте акаунт? <Link href="/auth/login">Увійти</Link>
                </div>
            </div>
        </main>
    );
}