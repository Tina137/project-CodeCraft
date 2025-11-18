import css from "./Footer.module.css";
import Link from "next/link";
import Icon from "../Icon/Icon";

const Footer = () => {
  return (
  <footer className={css.footer}>
    <div className={css.footerTop}>
      <div className={css.logoSection}>
      <Icon name="icon-favicon"></Icon>
      <p className={css.logoSectionText}>Подорожники</p>
      </div>
      <div className={css.socials}>
        <ul className={css.socialsList}>
          <li className={css.socialsItem}>
            <Link href="https://www.facebook.com/">
            <Icon name="icon-Facebook"></Icon>
            </Link>
          </li>
          <li className={css.socialsItem}>
            <Link href="https://www.instagram.com/">
            <Icon name="icon-Instagram"></Icon>
            </Link>
          </li>
          <li className={css.socialsItem}>
            <Link href="https://www.X.com/">
            <Icon name="icon-X"></Icon>
            </Link>
          </li>
          <li className={css.socialsItem}>
            <Link href="https://www.youtube.com/">
            <Icon name="icon-Youtube"></Icon>
            </Link>
          </li>
        </ul>
      </div>
      <div className={css.footerLinks}>
        <ul className={css.footerLinksList}>
          <li className={css.footerLinksItem}>
            <Link href="/" className={css.footerLinksItemText}>Головна</Link>
          </li>
          <li className={css.footerLinksItem}>
            <Link href="/stories" className={css.footerLinksItemText}>Історії</Link>
          </li>
          <li className={css.footerLinksItem}>
            <Link href="/travellers" className={css.footerLinksItemText}>Мандрівники</Link>
          </li>
        </ul>
      </div>
    </div>
    <p className={css.footerBottom}>
      © 2025 Подорожники. Всі права захищені.
    </p>
  </footer>
  );
};

export default Footer;
