"use client";

import React, { useState, useEffect } from "react";
import css from "./Popular.module.css";
import { GetStoriesResponse } from "@/lib/api/api";
import { getPopularStories } from "@/lib/api/clientApi";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import { Story } from "@/types/story";
import Loader from "../Loader/Loader";

interface PopularMainPageProps {
  initialData: GetStoriesResponse;
}

export default function Popular({ initialData }: PopularMainPageProps) {
  // ---------- Состояния ----------
  const [stories, setStories] = useState<Story[]>(initialData.data.stories);
  const [page, setPage] = useState(initialData.data.page);
  const [hasNextPage, setHasNextPage] = useState(initialData.data.hasNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(
    initialData.data.stories.length
  );
  const [paginationCount, setPaginationCount] = useState<number>(3);

  // ---------- Отслеживаем ширину окна ----------
  useEffect(() => {
    if (typeof window === "undefined") return; // защита для SSR

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------- Настройка viewport ----------
  useEffect(() => {
    if (windowWidth >= 1440) {
      setVisibleCount(3);
      setPaginationCount(3);
    } else if (windowWidth >= 786) {
      setVisibleCount(4);
      setPaginationCount(4);
    } else {
      setVisibleCount(stories.length); // мобильный: показываем что есть, пагинация отключена
      setPaginationCount(0);
    }
  }, [windowWidth]);

  // ---------- Проверка и подгрузка для первого рендера ----------
  useEffect(() => {
    const needToLoad = visibleCount - stories.length;
    if (needToLoad > 0 && hasNextPage && paginationCount > 0) {
      const loadInitial = async () => {
        setLoading(true);
        try {
          const resp: GetStoriesResponse = await getPopularStories(
            page + 1,
            needToLoad
          );
          const newStories = resp.data.stories.filter(
            (s) => !stories.some((existing) => existing._id === s._id)
          );
          setStories((prev) => [...prev, ...newStories]);
          setPage(resp.data.page);
          setHasNextPage(resp.data.hasNextPage);
        } catch (e) {
          console.error("[Popular] initial load error:", e);
          setError("Ошибка загрузки данных");
        } finally {
          setLoading(false);
        }
      };
      loadInitial();
    }
  }, [visibleCount, stories, hasNextPage, page, paginationCount]);

  // ---------- Подгрузка при клике ----------
  const handleLoadMore = async () => {
    if (!hasNextPage || loading || paginationCount === 0) return;

    setLoading(true);
    setError(null);

    try {
      const resp: GetStoriesResponse = await getPopularStories(
        page + 1,
        paginationCount
      );
      const newStories = resp.data.stories.filter(
        (s) => !stories.some((existing) => existing._id === s._id)
      );
      setStories((prev) => [...prev, ...newStories]);
      setPage(resp.data.page);
      setHasNextPage(resp.data.hasNextPage);
    } catch (e) {
      console.error("[Popular] loadMore error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Популярні історії</h2>

      <ul className={css.listBox}>
        {stories.map((story) => (
          <li key={story._id} className={css.wrapper}>
            <TravellersStoriesItem key={story._id} story={story} />
          </li>
        ))}
      </ul>

      <div className={css.controls}>
        {loading && <Loader />}
        {hasNextPage && paginationCount > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={css.loadMoreButton}
          >
            {loading ? "Завантаження..." : "Показати ще"}
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
