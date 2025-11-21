"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  getStoryById,
  getUserById,
  getPopularStories,
} from "@/lib/api/clientApi";
import type { Story, StoryOwner } from "@/types/story";
import { formatDate } from "@/utils/formatDate";

import { useSaveStory } from "@/hooks/useSaveStory";
import { useSavedStore } from "@/lib/store/savedStore";
import TravellersStoriesItem from "@/components/TravellersStoriesItem/TravellersStoriesItem";

import css from "./page.module.css";

const SERVER = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export default function StoryDetailsPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const router = useRouter();

  const [story, setStory] = useState<Story | null>(null);
  const [author, setAuthor] = useState<StoryOwner | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [popularStories, setPopularStories] = useState<Story[]>([]);
  const [visiblePopularCount, setVisiblePopularCount] = useState(2);

  const [loading, setLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addMutation, removeMutation } = useSaveStory();
  const toggleGlobalSaved = useSavedStore((s) => s.toggleSaved);
  const isSaved = useSavedStore((s) =>
    story ? s.savedList.includes(story._id) : false
  );
  const isSaving = addMutation.isPending || removeMutation.isPending;
  useEffect(() => {
    if (!storyId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await getStoryById(String(storyId));
        if (cancelled) return;
        const normalized: Story = {
          _id: raw._id,
          img: raw.img,
          title: raw.title,
          article: raw.article,
          category:
            typeof raw.category === "string"
              ? { _id: raw.category, name: "" }
              : raw.category,
          ownerId:
            typeof raw.ownerId === "string"
              ? { _id: raw.ownerId, name: "Автор", avatarUrl: null }
              : raw.ownerId,
          date: raw.date,
          favoriteCount: raw.favoriteCount ?? 0,
          createdAt: raw.createdAt ?? "",
          updatedAt: raw.updatedAt ?? "",
        };
        setStory(normalized);
        const categoryId =
          typeof raw.category === "string" ? raw.category : raw.category?._id;

        const ownerId =
          typeof raw.ownerId === "string" ? raw.ownerId : raw.ownerId?._id;
        const [catsJson, userWrapped] = await Promise.all([
          categoryId
            ? fetch(`${SERVER}/api/categories`)
                .then((r) => r.json())
                .catch(() => null)
            : null,
          ownerId ? getUserById(ownerId).catch(() => null) : null,
        ]);

        if (cancelled) return;
        if (categoryId && catsJson) {
          const cats = Array.isArray(catsJson)
            ? catsJson
            : (catsJson.data ?? []);

          if (Array.isArray(cats)) {
            const found = cats.find((c: any) => {
              const cid = typeof c._id === "string" ? c._id : c._id?.$oid;
              return cid === categoryId;
            });

            if (found?.name) setCategoryName(found.name);
          }
        }
        if (userWrapped) {
          const user = (userWrapped as any).data ?? userWrapped;
          if (user?._id) {
            const owner: StoryOwner = {
              _id: user._id,
              name: user.name,
              avatarUrl: user.avatarUrl ?? null,
            };
            setAuthor(owner);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Не вдалося завантажити історію");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  useEffect(() => {
    let cancelled = false;

    const loadPopular = async () => {
      try {
        setPopularLoading(true);
        const rawPopular = await getPopularStories(1, 10);
        if (cancelled) return;

        const items: Story[] =
          rawPopular?.data?.stories ??
          rawPopular?.stories ??
          (Array.isArray(rawPopular?.data) ? rawPopular.data : []) ??
          (Array.isArray(rawPopular) ? rawPopular : []);
        if (!Array.isArray(items)) {
          setPopularStories([]);
          return;
        }

        const filtered = storyId
          ? items.filter((s) => s._id !== String(storyId))
          : items;
        setPopularStories(filtered);
      } catch (err) {
        console.error("load popular stories error", err);
        if (!cancelled) setPopularStories([]);
      } finally {
        if (!cancelled) setPopularLoading(false);
      }
    };

    loadPopular();

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;

      if (width >= 1312) {
        setVisiblePopularCount(3);
      } else if (width >= 768) {
        setVisiblePopularCount(4);
      } else {
        setVisiblePopularCount(2);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);
  const handleToggleSave = () => {
    if (!story) return;

    const handle401 = (err: any) => {
      if (err?.response?.status === 401) {
        router.push("/auth/login");
      }
    };

    if (isSaved) {
      removeMutation.mutate(story._id, {
        onSuccess: () => toggleGlobalSaved(story._id),
        onError: handle401,
      });
    } else {
      addMutation.mutate(story._id, {
        onSuccess: () => toggleGlobalSaved(story._id),
        onError: handle401,
      });
    }
  };
  if (loading) {
    return (
      <main className={css.page}>
        <div className={css.container}>Завантаження…</div>
      </main>
    );
  }

  if (error || !story) {
    return (
      <main className={css.page}>
        <div className={css.container}>
          <h1>Історію не знайдено</h1>
          <p>{error ?? "Можливо, вона була видалена або ID некоректний."}</p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
            ID: <code>{String(storyId)}</code>
          </p>
        </div>
      </main>
    );
  }
  const visiblePopular = popularStories.slice(0, visiblePopularCount);

  return (
    <main className={css.page}>
      <div className={css.container}>
        <div className={css.titleRow}>
          <h1 className={css.title}>{story.title}</h1>
        </div>
        <div className={css.metaWrapper}>
          <div className={css.metaBlock}>
            <div className={css.metaRow}>
              <span className={css.metaLabel}>Автор статті</span>
              <span className={css.metaValue}>
                {author?.name || story.ownerId?.name || "Автор"}
              </span>
            </div>

            <div className={css.metaRow}>
              <span className={css.metaLabel}>Опубліковано</span>
              <span className={css.metaValue}>
                {formatDate(story.date || story.createdAt)}
              </span>
            </div>
          </div>

          {categoryName && (
            <span className={css.metaCategory}>{categoryName}</span>
          )}
        </div>
        <div className={css.mainImageWrapper}>
          <Image
            src={story.img || "/Placeholder_Image.png"}
            alt={story.title}
            width={1200}
            height={700}
            className={css.mainImage}
          />
        </div>
        <section className={css.contentSection}>
          <div className={css.articleWrapper}>
            <p className={css.articleText}>{story.article}</p>
          </div>

          <aside className={css.sidebar}>
            <div className={css.saveCard}>
              <h3 className={css.saveTitle}>Збережіть собі історію</h3>
              <p className={css.saveText}>
                Вона буде доступна у вашому профілі у розділі збережених.
              </p>

              <button
                className={css.saveButton}
                onClick={handleToggleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? "Збереження…"
                  : isSaved
                    ? "Видалити із збережених"
                    : "Зберегти"}
              </button>
            </div>
          </aside>
        </section>
        {visiblePopular.length > 0 && (
          <section className={css.popularSection}>
            <h2 className={css.popularTitle}>Популярні історії</h2>

            {popularLoading ? (
              <div className={css.popularLoading}>Завантаження…</div>
            ) : (
              <div className={css.popularList}>
                {visiblePopular.map((s) => (
                  <TravellersStoriesItem key={s._id} story={s} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
