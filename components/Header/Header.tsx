"use client";

import css from "./Header.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Icon from "@/components/Icon/Icon";
import { logout } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import { ConfirmModal } from "../Modal/ConfirmModal";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isHomePage = pathname === "/";
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  const textColorClass = !isHomePage ? css.textDark : "";
  const loginBtnClass = !isHomePage ? css.loginBtnGrey : "";
  const registerBtnClass = !isHomePage ? css.registerBtnBlue : "";

  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore(
    (state) => state
  );

  const userName = user?.name || "User";
  const avatarUrl = user?.avatarUrl || null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearIsAuthenticated();
      setIsLogoutModalOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const showAuthContent = isMounted && isAuthenticated;

  return (
    <>
      <header className={`${css.header} ${!isHomePage ? css.headerWhite : ""}`}>
        <Link href="/" className={css.logoContainer}>
          <Icon name="icon-favicon" />
          {isAuthPage ? (
            <p className={`${css.iconText} ${textColorClass}`}>
              Подор
            </p>
          ) : (
            <>
              <p className={`${css.iconText} ${textColorClass}`}>Подорожники</p>
            </>
          )}
        </Link>

        {!isAuthPage && (
          <nav className={css.nav}>
            <div className={css.desktopNavContainer}>
              {showAuthContent ? (
                <>
                  <ul className={css.navLink}>
                    <li className={css.navItem}>
                      <Link
                        href="/"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Головна
                      </Link>
                    </li>
                    <li className={css.navItem}>
                      <Link
                        href="/stories"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Історії
                      </Link>
                    </li>
                    <li className={css.navItem}>
                      <Link
                        href="/travellers"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Мандрівники
                      </Link>
                    </li>
                    <li className={css.navItem}>
                      <Link
                        href="/profile"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Мій профіль
                      </Link>
                    </li>
                  </ul>
                  <div className={css.wrapper}>
                    <Link href="/stories/create">
                      <button className={css.publishBtn}>
                        Опублікувати історію
                      </button>
                    </Link>
                    <div className={css.userProfile}>
                      <div className={css.avatar}>
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={userName}
                            className={css.avatarImg}
                          />
                        ) : (
                          <span style={{ color: "#999", fontSize: "20px" }}>
                            ?
                          </span>
                        )}
                      </div>
                      <span className={`${css.userName} ${textColorClass}`}>
                        {userName}
                      </span>
                      <button
                        className={`${css.logoutBtn} ${!isHomePage ? css.borderLeftDark : ""}`}
                        onClick={handleLogoutClick}
                      >
                        <Icon
                          name="icon-logout"
                          size={24}
                          className={textColorClass}
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ul className={css.navLink}>
                    <li className={css.navItem}>
                      <Link
                        href="/"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Головна
                      </Link>
                    </li>
                    <li className={css.navItem}>
                      <Link
                        href="/stories"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Історії
                      </Link>
                    </li>
                    <li className={css.navItem}>
                      <Link
                        href="/travellers"
                        className={`${css.navItemLink} ${textColorClass}`}
                      >
                        Мандрівники
                      </Link>
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
            </div>

            <div className={css.mobileNavContainer}>
              <button
                className={css.burgerButton}
                onClick={toggleMobileMenu}
                aria-label="Відкрити меню"
              >
                <Icon
                  name="icon-menu"
                  size={28}
                  className={!isHomePage ? css.textDark : ""}
                />
              </button>
            </div>
          </nav>
        )}
      </header>

      <div
        className={`${css.backdrop} ${isMobileMenuOpen ? css.open : ""}`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`${css.menuContainer} ${isMobileMenuOpen ? css.open : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={css.menuHeader}>
            <div className={css.logoContainer}>
              <Icon name="icon-favicon" />
              <p className={css.mobileMenuIconText}>Подорожники</p>
            </div>
            <button
              className={css.closeButton}
              onClick={toggleMobileMenu}
              aria-label="Закрити меню"
            >
              <Icon name="icon-close" size={24} />
            </button>
          </div>

          <nav className={css.mobileNav}>
            <button
              onClick={() => handleNavClick("/")}
              className={css.mobileNavLink}
            >
              Головна
            </button>
            <button
              onClick={() => handleNavClick("/stories")}
              className={css.mobileNavLink}
            >
              Історії
            </button>
            <button
              onClick={() => handleNavClick("/travellers")}
              className={css.mobileNavLink}
            >
              Мандрівки
            </button>
            {showAuthContent && (
              <button
                onClick={() => handleNavClick("/profile")}
                className={css.mobileNavLink}
              >
                Мій Профіль
              </button>
            )}
          </nav>

          <div className={css.mobileFooter}>
            {showAuthContent ? (
              <>
                  <button 
                  onClick={() => handleNavClick("/stories/create")}
                  className={css.mobilePublishBtn}>
                    Опублікувати історію
                  </button>
                <div className={css.mobileUserProfile}>
                  <div className={css.mobileAvatar}>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={userName}
                        className={css.mobileAvatarImg}
                      />
                    ) : (
                      <span style={{ color: "#999", fontSize: "20px" }}>?</span>
                    )}
                  </div>
                  <span className={css.mobileUserName}>{userName}</span>
                  <button
                    className={css.mobileLogoutBtn}
                    onClick={handleLogoutClick}
                  >
                    <Icon name="icon-logout" size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className={css.mobileAuthButtons}>
                <Link
                  href="/auth/login"
                  className={css.mobileLoginLink}
                  onClick={toggleMobileMenu}
                >
                  Вхід
                </Link>
                <Link
                  href="/auth/register"
                  className={css.mobileRegisterLink}
                  onClick={toggleMobileMenu}
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Ви точно хочете вийти?"
        message="Ми будемо сумувати за вами!"
        confirmText="Вийти"
        cancelText="Відмінити"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        onClose={() => setIsLogoutModalOpen(false)}
        isNavigation={false}
      />
    </>
  );
};

export default Header;
