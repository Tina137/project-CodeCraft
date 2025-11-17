"use client";

import css from "./Header.module.css";
import Link from "next/link";
import HeaderLogo from "../Icons/HeaderIcons/HeaderLogo";
import { usePathname } from "next/navigation"; 
import { useAuthStore } from "@/lib/store/authStore";

const Header = () => {
  const pathname = usePathname();

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  const isAutorized = useAuthStore((state) => state.isAuthenticated);

  return <header className={css.header}>
    <div className={css.logoContainer}>
    <HeaderLogo />
    <p className={css.iconText}>Подорожники</p>
    </div>
    {!isAuthPage &&(
      <nav className={css.nav}>
      
      {isAutorized ? (
        <>
      <ul className={css.navLink}>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Головна</Link>
        </li>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Історії</Link>
        </li>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Мандрівки</Link>
        </li>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Мій профіль</Link>
        </li>
      </ul>
      <div className={css.action}>
        <button className={css.publishBtn}>Опублікувати історію</button>
        <div>
          
        </div>
      </div>
      </>
      ) : (
        <>
        <ul className={css.navLink}>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Головна</Link>
        </li>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Історії</Link>
        </li>
        <li className={css.navItem}>
          <Link href="/" className={css.navItemLink}>Мандрівки</Link>
        </li>
      </ul>
      <ul className={css.navAuthLink}>
        <li className={css.navItem}>
          <Link href="/auth/login" className={css.navItemLinkLogin}>Вхід</Link>
          </li>
        <li className={css.navItem}>
          <Link href="/auth/register" className={css.navItemLinkRegister}>Реєстрація</Link>
          </li>
      </ul>
      </>
      )}
      </nav>
    )} 
  </header>;
};

export default Header;
