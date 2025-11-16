"use client";
import { useState, useEffect } from "react";
import TravellerInfo from "../../components/TravellerInfo/TravellerInfo";
// import StoriesList from "@/components/StoriesList";

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
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [loading, setLoading] = useState(true);

  // Завантажити дані мандрівника
  useEffect(() => {
    getMe().then(setUser);
  }, []);

  // Завантажити історії залежно від табу
  useEffect(() => {
    async function load() {
      setLoading(true);

      const data =
        tab === "saved" ? await getSavedStories() : await getMyStories();

      setStories(data);
      setLoading(false);
    }

    load();
  }, [tab]);

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
          className={tab === "saved" ? styles.active : ""}
          onClick={() => setTab("saved")}
        >
          Збережені історії
        </button>

        <button
          className={tab === "mine" ? styles.active : ""}
          onClick={() => setTab("mine")}
        >
          Мої історії
        </button>
      </div>

      {/* Stories */}
      {loading ? (
        <p>Завантаження історій...</p>
      ) : // <StoriesList stories={stories} />
      null}
    </div>
  );
}
