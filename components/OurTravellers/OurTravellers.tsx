"use client";

import React, { useState } from "react";
import css from "./OurTravellers.module.css";
import TravellersInfoCards from "../TravellersInfoCards/TravellersInfoCards";
import Loader from "../Loader/Loader";

import { getAllUsers } from "../../lib/api/clientApi";
import { TravelersResponse, Traveler } from "../../lib/api/api";

interface TravelersMainPageProps {
  initialData: TravelersResponse;
}

export default function OurTravellers({ initialData }: TravelersMainPageProps) {
  const [users, setUsers] = useState<Traveler[]>(initialData.data);
  const [page, setPage] = useState<number>(initialData.page);
  const [limit] = useState<number>(initialData.limit);
  const [total, setTotal] = useState<number>(initialData.total);
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initialData.hasNextPage
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    if (!hasNextPage || loading) return;

    const nextPage = page + 1;
    setLoading(true);
    setError(null);

    try {
      const resp: TravelersResponse = await getAllUsers(nextPage, limit);

      setUsers((prev) => [...prev, ...resp.data]);
      setPage(resp.page);
      setTotal(resp.total);
      setHasNextPage(resp.hasNextPage);
    } catch (e) {
      console.error("[TravelersMainPage] loadMore error:", e);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Наші Мандрівники</h2>
      <ul className={css.travellersBox}>
        {users.map((u) => (
          <li key={u._id} className={css.wrapper}>
            <TravellersInfoCards
              name={u.name}
              description={u.description}
              avatarUrl={u.avatarUrl}
              id={u._id}
            />
          </li>
        ))}
      </ul>

      <div className={css.controls}>
        {loading && <Loader />}
        {hasNextPage && (
          <button
            onClick={loadMore}
            disabled={loading}
            className={css.loadMoreButton}
          >
            {loading ? "Завантаження..." : "Переглянути всіх"}
          </button>
        )}
      </div>
    </div>
  );
}
