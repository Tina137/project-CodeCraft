"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TravellerInfo from "../../components/TravellerInfo/TravellerInfo";
import TravellersStories from "../../components/TravellersStories/TravellersStories";
import { Story as FullStory } from "@/types/story";

import {
  getMe,
  getStories,
} from "@/lib/api/clientApi";

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
    getMe()
      .then((data) => setUser(data))
      .catch(() => 
        router.push("/auth/register"));
  }, [router]);

 useEffect(() => {
  if (!user) return;

  const currentUser = user; 

  async function loadStories() {
    setLoading(true);

  try {
        const response = await getStories(); // повертає PaginatedStoriesResponse
        let data: FullStory[] = response.data;

        if (tab === "mine") {
          data = data.filter((story) => story.ownerId._id === currentUser._id);
        }

        setStories(data);
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
      {/* TravellerInfo */}
      {user && (
  <TravellerInfo
   
    name={user.name}
    description={user.description}
    avatarUrl={user.avatarUrl}
   
  />
)}

      {/* Switcher */}
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

      {/* Stories */}
{loading ? (
  <p>Завантаження історій...</p>
) : (
  <TravellersStories items={stories} />
)}
    </div>
  );
}
