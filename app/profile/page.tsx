"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TravellerInfo from "../../components/TravellerInfo/TravellerInfo";
import TravellersStories from "../../components/TravellersStories/TravellersStories";

import {
  getMe,
  getSavedStories,
  getMyStories,
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
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [loading, setLoading] = useState(true);

  // Завантажити дані мандрівника
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {
        router.push("/auth/register"); 
      });
  }, []);

  // Завантажити історії залежно від табу
  useEffect(() => {
    if (!user) return;
     async function loadStories(user: ProfileUser) {
     setLoading(true);

      const data =
        tab === "saved"
         ? await getSavedStories(user.savedStories) 
         : await getMyStories(user._id);

      setStories(data);
      setLoading(false);
    }

    loadStories(user);

  }, [tab, user]);

  // if (!user) return <p>Завантаження...</p>;

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
