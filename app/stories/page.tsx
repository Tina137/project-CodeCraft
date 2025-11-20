"use client";

import React, { useEffect, useState } from "react";
import type { Story } from "@/types/story";
import css from "./page.module.css";
import TravellersStoriesItem from "@/components/TravellersStoriesItem/TravellersStoriesItem";

const SERVER = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const CATEGORY_MAP: { name: string; id: string }[] = [
  { name: "Європа", id: "68fb50c80ae91338641121f2" },
  { name: "Азія", id: "68fb50c80ae91338641121f0" },
  { name: "Пустелі", id: "68fb50c80ae91338641121f6" },
  { name: "Африка", id: "68fb50c80ae91338641121f4" },
];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [category, setCategory] = useState<string | null>(null);

  function buildUrl(p: number) {
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("perPage", String(perPage));
    if (category) params.set("category", category);
    return `${SERVER}/api/stories?${params.toString()}`;
  }

  useEffect(() => {
    fetch(`${SERVER}/api/categories`)
      .then((r) => r.json())
      .then((json) => {
        const cats = Array.isArray(json) ? json : (json?.data ?? []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => {
        console.error("categories load error", err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setHasMore(true);

    fetch(buildUrl(1), { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const items: Story[] =
          json?.data?.stories ??
          json?.stories ??
          (Array.isArray(json?.data) ? json.data : []) ??
          (Array.isArray(json) ? json : []);
        if (!Array.isArray(items)) {
          setStories([]);
          return;
        }
        setStories(items);
        setHasMore(items.length >= perPage);
      })
      .catch((err) => {
        console.error("load stories error", err);
        setStories([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;

    fetch(buildUrl(next), { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const items: Story[] =
          json?.data?.stories ??
          json?.data ??
          json?.stories ??
          (Array.isArray(json) ? json : []);

        setStories((prev) => [...prev, ...items]);
        setPage(next);
        setHasMore(items.length >= perPage);
      })
      .catch((err) => {
        console.error("load more error", err);
      })
      .finally(() => setLoadingMore(false));
  };

  return (
    <main className={css.page}>
      <div className={css.container}>
        <h1 className={css.title}>Історії Мандрівників</h1>
        <div className={css.controls}>
          <div className={css.filters}>
            <button
              className={!category ? css.filterActive : css.filter}
              onClick={() => setCategory(null)}
            >
              Всі історії
            </button>
            {CATEGORY_MAP.map((c) => (
              <button
                key={c.id}
                className={category === c.id ? css.filterActive : css.filter}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className={css.filtersSelectWrap}>
            <label className={css.selectLabel}>Категорії</label>
            <select
              className={css.filtersSelect}
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              aria-label="Категорія"
            >
              <option value="Всі історії">Всі історії</option>
              {CATEGORY_MAP.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={css.list}>
          {loading ? (
            <div className={css.loading}>Завантаження…</div>
          ) : stories.length === 0 ? (
            <div className={css.empty}>Нема історій</div>
          ) : (
            stories.map((s) => (
              <div className={css.item} key={s._id}>
                <TravellersStoriesItem story={s} />
              </div>
            ))
          )}
        </div>

        <div className={css.loadMoreWrap}>
          {hasMore && !loading && (
            <button
              className={css.loadMore}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Завантаження…" : "Показати ще"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
