"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./TravellersInfoCards.module.css";

interface Props {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
}

export default function TravellerCard({ id, name, description, avatarUrl }: Props) {
  return (
    <article className={styles.container}>
      <img
  src={avatarUrl}
  alt={`Фото мандрівника ${name}`}
  className={styles.photo}
  width={120}
  height={120}
/>


      <div className={styles.infoBlock}>
        <h3 className={styles.personName}>{name}</h3>

        <p className={styles.personAbout}>
          {description}
        </p>

        <Link
          href={`/travellers/${id}`}
          className={styles.profileLink}
        >
          Переглянути профіль
        </Link>
      </div>
    </article>
  );
}
