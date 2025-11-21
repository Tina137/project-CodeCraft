"use client";

import css from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const setAuth = useAuthStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            const formValues = Object.fromEntries(formData) as unknown as User;
            const result = await login(formValues);
            
            if (result) {
                setAuth(result);
                toast.success("Вітаємо! Вхід успішний.");
                router.push("/");
            } else {
                setError("Invalid email or password");
                toast.error("Неправильні пошта або пароль.");
            }
        } catch (err) {
            toast.error("Неправильні пошта або пароль.");
        }
    }
    
    return (
        <main className={css.mainContent}>
            
            <div className={css.tabNavigation}>
                <Link href="/auth/register" className={css.tabLink}>
                    Реєстрація
                </Link>
                <Link href="/auth/login" className={`${css.tabLink} ${css.active}`}>
                    Вхід
                </Link>
            </div>
            <div className={css.loginContainer}>
                <h1>Вхід</h1>
                <p className={css.subtitle}>
                    Вітаємо знову у спільноту мандрівників!
                </p>
                
                <form onSubmit={handleSubmit}>
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
                        Увійти
                    </button>
                </form>
                <div className={css.formFooter}>
                    Немає акаунту? <Link href="/auth/register">Зареєструватись</Link>
                </div>

            </div>
        </main>
    );
}