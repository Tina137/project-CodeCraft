import { useRouter } from "next/navigation";
import styles from "./TravellerInfo.module.css";

interface TravellerInfoProps {
  name: string;
  description: string;
  avatarUrl: string;
  articlesAmount?: number;
}

export default function TravellerInfo({ name, description, avatarUrl }: TravellerInfoProps) {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <img src={avatarUrl} alt={name} className={styles.image} />
      <h2>{name}</h2>
      <p>{description}</p>
      <button onClick={() => router.push("/stories")} className={styles.backButton}>
        Назад до історій
      </button>
    </div>
  );
}