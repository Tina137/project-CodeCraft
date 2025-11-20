"use client";

import styles from "./TravellerInfo.module.css";
import Image from "next/image";

interface TravellerInfoProps {
  name: string;
  description: string | null;
  avatarUrl: string;
}

export default function TravellerInfo({
  name,
  description,
  avatarUrl,
}: TravellerInfoProps) {
  return (
    <section className={styles.travellerInfo} aria-label="traveller info">
      <div className={styles.travellerImage}>
        <Image
          className={styles.avatar}
          src={avatarUrl || "/Placeholder_Image.png"}
          alt={`${name} avatar`}
          width={199}
          height={199}
        />
      </div>

      <div className={styles.travellerDetails}>
        <h3 className={styles.travellerName}>{name}</h3>

        {description && (
          <p className={styles.travellerDescription}>{description}</p>
        )}
      </div>
    </section>
  );
}
