"use client";

import { useEffect, useState } from "react";
import TravellerInfoCard from "../TravellersInfoCards/TravellersInfoCards";
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
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [perPage, setPerPage] = useState(0);

  const fetchTravelers = async (pageNumber: number, perPageArg: number) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await axios.get(
        `https://project-codecraft-backend.onrender.com/api/users?page=${pageNumber}&limit=${perPageArg}`,
        { withCredentials: true }
      );

      const adapted = response.data.data.map((user: any) => ({
        id: user._id,
        name: user.name,
        description: user.description || "Немає опису",
        avatarUrl: user.avatarUrl || "/default-avatar.png",
        articlesAmount: user.articlesAmount,
      }));

      setTravelers((prev) => [...prev, ...adapted]);
      setHasNextPage(response.data.hasNextPage);
    } catch (err) {
      console.error("Помилка при завантаженні мандрівників:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const width = window.innerWidth;
    const initial = width >= 1024 ? 12 : 8;
    setPerPage(initial);
  }, []);

  useEffect(() => {
    if (perPage > 0) {
      fetchTravelers(1, perPage);
    }
  }, [perPage]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTravelers(nextPage, perPage);
  };

  if (loading && !travelers.length) return <p>Завантаження мандрівників...</p>;
  if (!travelers.length) return <p>Немає мандрівників для відображення.</p>;

  return (
    <div className="wrapper">
      <div className={css.listWrapper}>
        <div className={css.listCardsWrapper}>
          {travelers.map((traveler) => (
            <TravellerInfoCard key={traveler.id} {...traveler} />
          ))}
        </div>

        {hasNextPage && (
          <div className={css.listPagination}>
            {loadingMore ? (
              <span>Завантаження...</span>
            ) : (
              <button
                className={css.listPaginationBtn}
                onClick={handleLoadMore}
              >
                Показати ще
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
