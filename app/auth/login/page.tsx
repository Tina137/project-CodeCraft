"use client";

import css from "./page.module.css";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {login} from "@/lib/api/clientApi";
import {User} from "@/types/user";
import {ApiError} from  "@/app/api/api";
import { useAuthStore } from "@/lib/store/authStore";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const setAuth = useAuthStore((state) => state.setUser);

    const handleSubmit = async (formData: FormData) => {
        try{
            const formValues = Object.fromEntries(formData) as unknown as User;
            const result = await login(formValues);
            if(result){
                setAuth(result);
                router.push("/");
            }else{
                setError("Invalid email or password");
            }
        }catch (err){
            setError((err as ApiError).response?.data?.error ?? (err as ApiError).message ?? "An unexpected error occurred");
        }    
    }
    return (
        <main className={css.mainContent}>
            <div className={css.loginContainer}>
                <h1>Вхід</h1>
                <p className={css.subtitle}>
                    Вітаємо знову у спільноту мандрівників!
                </p>

                <form action={handleSubmit}>
                    
                    <div className={css.formGroup}>
                        <label htmlFor="email">Пошта*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue="hello@podorozhnyky.ua" 
                            required
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="password">Пароль*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            defaultValue="***********" 
                            required
                        />
                    </div>

                    <button type="submit" className={css.btnPrimary}>
                        Увійти
                    </button>
                </form>

            </div>
        </main>
    );
}