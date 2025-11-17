"use client";

import css from "./Header.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Icon from "@/components/Icon/Icon";
import { logout } from "@/lib/api/clientApi";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isHomePage = pathname === '/';
  
  const textColorClass = !isHomePage ? css.textDark : "";

  // Логіка класів для кнопок
  const loginBtnClass = !isHomePage ? css.loginBtnGrey : "";
  const registerBtnClass = !isHomePage ? css.registerBtnBlue : "";

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore((state) => state);

  const userName = user?.name || "User"; 
  const avatarUrl = user?.avatarUrl || null;

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

  return (
    <header className={`${css.header} ${!isHomePage ? css.headerWhite : ''}`}>
      <div className={css.logoContainer}>
        <Icon name="icon-favicon" />
        <p className={`${css.iconText} ${textColorClass}`}>Подорожники</p>
      </div>

      {!isAuthPage && (
        <nav className={css.nav}>
          {isAuthenticated ? (
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
                  {/* Кнопка ВХІД: додаємо loginBtnClass */}
                  <Link 
                    href="/auth/login" 
                    className={`${css.navItemLinkLogin} ${loginBtnClass}`}
                  >
                    Вхід
                  </Link>
                </li>
                <li className={css.navItem}>
                  {/* Кнопка РЕЄСТРАЦІЯ: додаємо registerBtnClass */}
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