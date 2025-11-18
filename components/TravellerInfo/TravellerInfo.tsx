"use client";

import Link from "next/link";
import styles from "./TravellerInfo.module.css";
import { useRouter } from "next/navigation";

interface TravellerInfoProps {
  name: string;
  description?: string | null;
  avatarUrl: string;
  articlesAmount?: number;
  _id: string;
  showViewProfileButton?: boolean;
}

export default function TravellerInfo({
  name,
  description,
  avatarUrl,
  articlesAmount,
  _id,
  showViewProfileButton = true,
}: TravellerInfoProps) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <img
        src={avatarUrl || "/Placeholder_Avatar_Image.png"}
        alt={name}
        className={styles.image}
        onError={(e) => {
          e.currentTarget.src = "/Placeholder_Avatar_Image.png";
        }}
      />

      <div className={styles.info}>
        <h2 className={styles.title}>{name}</h2>
        {description && <p className={styles.description}>{description}</p>}
        {articlesAmount !== undefined && (
          <p className={styles.articles}>
            {articlesAmount} {articlesAmount === 1 ? "історія" : "історій"}
          </p>
        )}
      </div>
      
      {showViewProfileButton && (
        <Link href={`/travellers/${_id}`} className={styles.button}>
          Переглянути профіль
        </Link>
      )}
    </div>
  );
}
