"use client";

import { useRouter } from "next/navigation";
import styles from "./TravellerInfo.module.css";

interface TravellerInfoProps {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  articlesAmount?: number;
}

export default function TravellerInfo({id, name, description, avatarUrl }: TravellerInfoProps) {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <img src={avatarUrl} alt={name} className={styles.image} />
      
      <div className={styles.info}>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.description}>{description}</p>
        <button
          className={styles.profileButton}
          onClick={() => router.push(`/travellers/${id}`)}
        >
          Переглянути профіль
        </button>
      </div>
    </div>
  );
}