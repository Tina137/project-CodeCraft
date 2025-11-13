"use client";
import css from "./page.module.css";
import {useState} from "react";
import {register} from "@/lib/api/clientApi";
import {useRouter} from "next/navigation";
import {User} from "@/types/user";
import {ApiError} from  "@/app/api/api";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const handleSubmit = async (formData: FormData) => {
        try{
            const formValues = Object.fromEntries(formData) as unknown as User;
            const result = await register(formValues);
            if(result){
                router.push("/");
            }else{
                setError("Registration failed. Please try again.");
            }
        }catch (err){
            setError((err as ApiError).response?.data?.error ?? (err as ApiError).message ?? "An unexpected error occurred");
        }
    }
    return (
        <main className={css.mainContent}>
            <div className={css.loginContainer}>
                <h1>Реєстрація</h1>
                <p className={css.subtitle}>
                    Раді вас бачити у спільноті мандрівників!
                </p>

                <form action={handleSubmit}>
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

                    <button type="submit" className={css.btnPrimary}>
                        Зареєструватись
                    </button>
                </form>
            </div>
        </main>
    );
}