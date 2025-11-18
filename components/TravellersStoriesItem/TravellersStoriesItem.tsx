"use client";

import { Story } from "@/types/story";
import Image from "next/image";
import css from "./TravellersStoriesItem.module.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import Icon from "../Icon/Icon";
import { useSaveStory } from "@/hooks/useSaveStory";
import { useState, useEffect } from "react";
import { useSavedStore } from "@/lib/store/savedStore";

interface TravellersStoriesItemProps {
  story: Story;
  isSaved: boolean;
}

export default function TravellersStoriesItem({
  story,
  isSaved,
}: TravellersStoriesItemProps) {
  const router = useRouter();

  const { addMutation, removeMutation } = useSaveStory();

  const toggleGlobalSaved = useSavedStore((s) => s.toggleSaved);

  const [saved, setSaved] = useState(isSaved);
  const [count, setCount] = useState(story.favoriteCount);

  // Синхронізація із глобальним savedList
  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const toggleSave = () => {
    const handle401 = (err: any) => {
      if (err?.response?.status === 401) {
        router.push("/auth/login");
      }
    };

    if (saved) {
      removeMutation.mutate(story._id, {
        onSuccess: () => {
          toggleGlobalSaved(story._id);
          setSaved(false);
          setCount((p) => p - 1);
        },
        onError: handle401,
      });
    } else {
      addMutation.mutate(story._id, {
        onSuccess: () => {
          toggleGlobalSaved(story._id);
          setSaved(true);
          setCount((p) => p + 1);
        },
        onError: handle401,
      });
    }
  };

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const openStory = () => {
    router.push(`/stories/${story._id}`);
  };

  return (
    <li className={css.card}>
      <Image
        className={css.cardImage}
        src={story.img || "/Placeholder_Image.png"}
        alt={story.title}
        width={335}
        height={223}
      />

      <div className={css.cardContent}>
        <div className={css.cardTop}>
          <p className={css.cardCategory}>{story.category.name}</p>
          <h2 className={css.cardTitle}>{story.title}</h2>
          <p className={css.cardDescription}>{story.article}</p>
        </div>

        <div className={css.cardBottom}>
          <div className={css.cardAuthor}>
            <Image
              className={css.authorAvatar}
              src={story.ownerId.avatarUrl || "/Placeholder_Avatar_Image.png"}
              alt={story.ownerId.name}
              width={48}
              height={48}
            />
            <div className={css.authorInfo}>
              <p className={css.authorName}>{story.ownerId.name}</p>
              <div className={css.authorMeta}>
                <p className={css.authorDate}>{formatDate(story.date)}</p>
                <span className={css.metaDot}>•</span>

                <div className={css.favorite}>
                  <span className={css.favoriteCount}>{count}</span>
                  <Icon
                    name="icon-bookmark"
                    size={16}
                    className={css.favoriteIcon}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={css.cardActions}>
            <button className={css.buttonPrimary} onClick={openStory}>
              Переглянути статтю
            </button>

            <button
              className={`${css.buttonIcon} ${
                saved ? css.buttonIconActive : ""
              }`}
              disabled={isLoading}
              onClick={toggleSave}
            >
              {isLoading ? (
                <span className={css.loaderIcon} />
              ) : (
                <Icon
                  name="icon-bookmark"
                  size={24}
                  className={css.buttonIconSvg}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
