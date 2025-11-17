"use client";

import css from "./Header.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Icon from "@/components/Icon/Icon";
import { logout } from "@/lib/api/clientApi";
import { useEffect, useState } from "react"; // 1. Додаємо useState та useEffect

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // 2. Стан, щоб знати, чи ми вже на клієнті
  const [isMounted, setIsMounted] = useState(false);

  const isHomePage = pathname === '/';
  
  const textColorClass = !isHomePage ? css.textDark : "";
  const loginBtnClass = !isHomePage ? css.loginBtnGrey : "";
  const registerBtnClass = !isHomePage ? css.registerBtnBlue : "";

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore((state) => state);

  const userName = user?.name || "User"; 
  const avatarUrl = user?.avatarUrl || null;

  // 3. Активуємо isMounted тільки після першого рендеру на клієнті
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); 
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearIsAuthenticated(); 
      router.push("/");
      router.refresh(); 
    }
  };

  // 4. Якщо ми ще на сервері або сторінка авторизації - рендеримо спрощену версію
  // Це запобігає помилкам гідратації
  if (!isMounted) {
     // Можна повернути null або скелетон, 
     // але краще повернути хедер без кнопок профілю, щоб не стрибала верстка.
     // Для простоти поки повернемо null або статичну версію:
     return null; 
     // Або можна просто дати коду йти далі, але блокувати рендер частин, залежних від isAuthenticated
  }

  return (
    <header className={`${css.header} ${!isHomePage ? css.headerWhite : ''}`}>
      <div className={css.logoContainer}>
        <Icon name="icon-favicon" />
        <p className={`${css.iconText} ${textColorClass}`}>Подорожники</p>
      </div>

      {!isAuthPage && (
        <nav className={css.nav}>
          {/* 5. Важлива перевірка: рендеримо логіку тільки якщо isMounted === true */}
          {isMounted && isAuthenticated ? (
            <>
              <ul className={css.navLink}>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Головна</Link>
                </li>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Історії</Link>
                </li>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Мандрівки</Link>
                </li>
                <li className={css.navItem}>
                  <Link href="/profile" className={`${css.navItemLink} ${textColorClass}`}>Мій профіль</Link>
                </li>
              </ul>

              <div className={css.wrapper}>
                <button className={css.publishBtn}>
                  Опублікувати історію
                </button>

                <div className={css.userProfile}>
                  <div className={css.avatar}>
                    {/* Додаткова перевірка для src, щоб не було null */}
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className={css.avatarImg} />
                    ) : (
                      <span style={{ color: "#999", fontSize: "20px" }}>?</span>
                    )}
                  </div>

                  <span className={`${css.userName} ${textColorClass}`}>{userName}</span>

                  <button 
                    className={`${css.logoutBtn} ${!isHomePage ? css.borderLeftDark : ''}`} 
                    aria-label="Вийти"
                    onClick={handleLogout}
                  >
                    <Icon name="icon-logout" size={24} className={textColorClass}/> 
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Блок для неавторизованих */
            <>
              <ul className={css.navLink}>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Головна</Link>
                </li>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Історії</Link>
                </li>
                <li className={css.navItem}>
                  <Link href="/" className={`${css.navItemLink} ${textColorClass}`}>Мандрівки</Link>
                </li>
              </ul>
              <ul className={css.navAuthLink}>
                <li className={css.navItem}>
                  <Link 
                    href="/auth/login" 
                    className={`${css.navItemLinkLogin} ${loginBtnClass}`}
                  >
                    Вхід
                  </Link>
                </li>
                <li className={css.navItem}>
                  <Link 
                    href="/auth/register" 
                    className={`${css.navItemLinkRegister} ${registerBtnClass}`}
                  >
                    Реєстрація
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;