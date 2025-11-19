"use client";

import styles from "./TravellerInfo.module.css";

interface TravellerInfoProps {
  name: string;
  description: string | null;
  avatarUrl: string;
}

export default function TravellerInfo({ name, description, avatarUrl }: TravellerInfoProps) {
  return (
    <div className={styles.wrapper}>
      <img className={styles.image} src={avatarUrl}/>
      <div className={styles.info}>
        <h2 className={styles.title}>{name}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}