"use client";

import { useEffect, useState } from "react";
import TravellerInfoCard from "../TravellerInfo/TravellerInfo";
import css from "./TravellersList.module.css";
import axios from "axios";

type Traveler = {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  articlesAmount?: number;
};

export default function TravellersList() {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Встановлюємо початкову кількість видимих карточок
  useEffect(() => {
    const initialCount = window.innerWidth >= 1024 ? 12 : 8;
    setVisibleCount(initialCount);
  }, []);

  // Підвантажуємо мандрівників напряму з бекенду
  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const response = await axios.get(
          "https://project-codecraft-backend.onrender.com/travellers",
          { withCredentials: true }
        );
        const adapted = response.data.users.map((user: any) => ({
          id: user._id,
          name: user.name,
          description: user.description || "Немає опису",
          avatarUrl: user.avatarUrl || "/default-avatar.png",
          articlesAmount: user.articlesAmount,
        }));
        setTravelers(adapted);
      } catch (err) {
        console.error("Помилка при завантаженні мандрівників:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelers();
  }, []);

  const displayedTravelers = travelers.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, travelers.length));
  };

  if (loading) return <p>Завантаження мандрівників...</p>;
  if (!travelers.length) return <p>Немає мандрівників для відображення.</p>;

  return (
    <div className={css.wrapper}>
      <div className={css.cardsWrapper}>
        {displayedTravelers.map(traveler => (
          <TravellerInfoCard key={traveler.id} {...traveler} />
        ))}
      </div>

      {visibleCount < travelers.length && (
        <div className={css.pagination}>
          <button className={css.paginationBtn} onClick={handleLoadMore}>
            Переглянути всіх
          </button>
        </div>
      )}
    </div>
  );
}
