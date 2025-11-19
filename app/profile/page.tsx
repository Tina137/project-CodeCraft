"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TravellerInfo from "../../components/TravellerInfo/TravellerInfo";
import TravellersStories from "../../components/TravellersStories/TravellersStories";
import { Story as FullStory } from "@/types/story";
import { getMe, getStories } from "@/lib/api/clientApi";
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
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [stories, setStories] = useState<FullStory[]>([]);
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();
        setUser(me.data); // або me
      } catch {
        router.push("/auth/register");
      }
    }
    loadUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const userId = user._id;
    const savedIds = new Set(user.savedStories);

    async function loadStories() {
      setLoading(true);

      try {
        const response = await getStories();
        const allStories: FullStory[] = response.data.stories;

        const filteredStories = allStories.filter((story) => {
          if (tab === "mine") return story.ownerId._id === userId;
          if (tab === "saved") return savedIds.has(story._id);
          return false;
        });

        setStories(filteredStories);
      } catch (error) {
        console.error("Помилка завантаження історій:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, [tab, user]);

  if (!user) return <p>Завантаження...</p>;

  return (
    <div className={styles.container}>
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

      {loading ? (
        <p>Завантаження історій...</p>
      ) : (
        <TravellersStories items={stories} />
      )}
    </div>
  );
}