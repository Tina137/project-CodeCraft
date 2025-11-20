"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/TravellersStories/TravellersStories";

import {
  getMe,
  clientFetchStoriesPage,
  getStoryById,
} from "@/lib/api/clientApi";
import { useStoriesPerPage } from "@/hooks/useStoriesPerPage";

import type {
  Story as FullStory,
  PaginatedStoriesResponse,
} from "@/types/story";
import styles from "./page.module.css";

interface ProfileUser {
  _id: string;
  name: string;
  avatarUrl: string;
  description: string;
  articlesAmount?: number;
  savedStories: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const perPage = useStoriesPerPage();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [stories, setStories] = useState<FullStory[]>([]);
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();
        setUser(me.data);
      } catch {
        router.push("/auth/register");
      }
    }
    loadUser();
  }, [router]);

  const loadMyStories = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const response: PaginatedStoriesResponse = await clientFetchStoriesPage(
        user._id,
        1,
        perPage
      );

      setStories(response.data);
    } catch (e) {
      console.error("Error fetching 'My Stories':", e);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [user, perPage]);

  const loadSavedStories = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const ids = user.savedStories;

      const requests = ids.map((id) => getStoryById(id));

      const results = await Promise.all(requests);

      setStories(results);
    } catch (e) {
      console.error("Error fetching saved stories:", e);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (tab === "mine") loadMyStories();
    else loadSavedStories();
  }, [tab, user, loadMyStories, loadSavedStories]);

  if (!user) return <p>Завантаження...</p>;

  return (
    <div className={styles.section}>
      <div className={styles.topWrapper}>
      <TravellerInfo
        name={user.name}
        description={user.description}
        avatarUrl={user.avatarUrl}
      />

      <div className={styles.tabs}>
        <button
          className={tab === "saved" ? styles.active : styles.inactive}
          onClick={() => setTab("saved")}
        >
          Збережені історії
        </button>

        <button
          className={tab === "mine" ? styles.active : styles.inactive}
          onClick={() => setTab("mine")}
        >
          Мої історії
        </button>
      </div>
      </div>

      <div className={styles.storiesWrapper}>
      {loading ? (
        <p>Завантаження історій...</p>
      ) : (
        <TravellersStories items={stories} />
      )}
      </div>
    </div>
  );
}
