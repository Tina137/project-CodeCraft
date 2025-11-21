"use client";

import { Story } from "@/types/story";
import Image from "next/image";
import css from "./TravellersStoriesItem.module.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import Icon from "../Icon/Icon";
import { useSaveStory } from "@/hooks/useSaveStory";
import { useState } from "react";
import { useSavedStore } from "@/lib/store/savedStore";
import { useAuthStore } from "@/lib/store/authStore";
import { ConfirmModal } from "@/components/Modal/ConfirmModal";

interface Props {
  story: Story;
}

export default function TravellersStoriesItem({ story }: Props) {
  const router = useRouter();

  const savedList = useSavedStore((s) => s.savedList);
  const savedLoaded = useSavedStore((s) => s.savedLoaded);
  const userId = useSavedStore((s) => s.userId);

  const isAuth = useAuthStore((s) => s.isAuthenticated);

  const toggleGlobalSaved = useSavedStore((s) => s.toggleSaved);
  const { addMutation, removeMutation } = useSaveStory();

  const isSaved = isAuth && savedLoaded && savedList.includes(story._id);

  const [count, setCount] = useState(story.favoriteCount);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const toggleSave = () => {
    if (!savedLoaded) return;

    if (!isAuth || !userId) {
      setShowAuthModal(true);
      return;
    }

    const handle401 = (err: any) => {
      if (err?.response?.status === 401) {
        setShowAuthModal(true);
      }
    };

    if (isSaved) {
      removeMutation.mutate(story._id, {
        onSuccess: () => {
          toggleGlobalSaved(story._id);
          setCount((p) => p - 1);
        },
        onError: handle401,
      });
    } else {
      addMutation.mutate(story._id, {
        onSuccess: () => {
          toggleGlobalSaved(story._id);
          setCount((p) => p + 1);
        },
        onError: handle401,
      });
    }
  };

  const openStory = () => router.push(`/stories/${story._id}`);
  const openEditor = () => router.push(`/stories/${story._id}/edit`);

  const ownerId =
    typeof story.ownerId === "string" ? story.ownerId : story.ownerId?._id;

  const isOwner = userId === ownerId;

  return (
    <>
      <div className={css.card}>
        <Image
          className={css.cardImage}
          src={story.img || "/Placeholder_Image.png"}
          alt={story.title || "Story image"}
          width={335}
          height={223}
        />

        <div className={css.cardContent}>
          {/* TOP */}
          <div className={css.cardTop}>
            <p className={css.cardCategory}>{story.category?.name || ""}</p>
            <h2 className={css.cardTitle}>{story.title || ""}</h2>
            <p className={css.cardDescription}>{story.article || ""}</p>
          </div>

          {/* BOTTOM */}
          <div className={css.cardBottom}>
            <div className={css.cardAuthor}>
              <Image
                className={css.authorAvatar}
                src={
                  story.ownerId?.avatarUrl || "/Placeholder_Avatar_Image.png"
                }
                alt={story.ownerId?.name || "Автор"}
                width={48}
                height={48}
              />

              <div className={css.authorInfo}>
                <p className={css.authorName}>{story.ownerId?.name}</p>

                <div className={css.authorMeta}>
                  <p className={css.authorDate}>
                    {formatDate(story.date || story.createdAt)}
                  </p>
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

            {/* ACTIONS */}
            <div className={css.cardActions}>
              <button className={css.buttonPrimary} onClick={openStory}>
                Переглянути статтю
              </button>

              {savedLoaded &&
                (isOwner ? (
                  <button className={css.buttonIcon} onClick={openEditor}>
                    <Icon
                      name="icon-edit"
                      size={24}
                      className={css.buttonIconSvg}
                    />
                  </button>
                ) : (
                  <button
                    className={`${css.buttonIcon} ${
                      isSaved ? css.buttonIconActive : ""
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
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <ConfirmModal
        isOpen={showAuthModal}
        title="Помилка під час збереження"
        message="Щоб зберегти статтю, вам потрібно увійти. Якщо ще немає облікового запису — зареєструйтесь."
        confirmText="Увійти"
        cancelText="Зареєструватись"
        onClose={() => setShowAuthModal(false)}
        onCancel={() => {
          setShowAuthModal(false);
          router.push("/auth/register");
        }}
        onConfirm={() => {
          setShowAuthModal(false);
          router.push("/auth/login");
        }}
        routeLogin="/auth/login"
        routeReg="/auth/register"
      />
    </>
  );
}
