"use client";

import { useRouter } from "next/navigation";
import styles from "./TravellerInfo.module.css";
import Link from "next/link";

interface TravellerInfoProps {
  name: string;
  description: string;
  avatarUrl: string;
  articlesAmount?: number;
  _id: string;
}

export default function TravellerInfo({
  name,
  description,
  avatarUrl,
  _id,
}: TravellerInfoProps) {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <img src={avatarUrl} alt={name} className={styles.image} />

      <div className={styles.info}>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <Link href={`/travellers/${_id}`} className={styles.button}>
        Переглянути профіль
      </Link>
    </div>
  );
}
