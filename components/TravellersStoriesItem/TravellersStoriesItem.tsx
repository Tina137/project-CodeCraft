"use client";

import { Story } from "@/types/story";
import Image from "next/image";
import css from "./TravellersStoriesItem.module.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";

interface TravellersStoriesItemProps {
  story: Story | undefined;
}

const TravellersStoriesItem = ({ story }: TravellersStoriesItemProps) => {
  const router = useRouter();

  const handleClick = (storyId: string) => {
    router.push(`/stories/${storyId}`);
  };

  return (
    <li className={css.card}>
      <Image
        className={css.cardImage}
        src={story?.img || "/Placeholder_Image.png"}
        alt={story?.title ?? "Story Image"}
        width={335}
        height={223}
      />

      <div className={css.cardContent}>
        {story && (
          <>
            <header className={css.cardHeader}>
              <p className={css.cardCategory}>{story.category.name}</p>
              <h2 className={css.cardTitle}>{story.title}</h2>
              <p className={css.cardDescription}>{story.article}</p>
            </header>

            <footer className={css.cardFooter}>
              <div className={css.cardAuthor}>
                <Image
                  className={css.authorAvatar}
                  src={
                    story.ownerId.avatarUrl || "/Placeholder_Avatar_Image.png"
                  }
                  alt={story.ownerId.name ?? "Author Avatar"}
                  width={48}
                  height={48}
                />

                <div className={css.authorInfo}>
                  <p className={css.authorName}>{story.ownerId.name}</p>
                  <div className={css.authorMeta}>
                    <p className={css.authorDate}>{formatDate(story.date)}</p>
                    <span className={css.metaDot}>•</span>

                    <div className={css.favorite}>
                      <span className={css.favoriteCount}>
                        {story.favoriteCount}
                      </span>
                      <svg className={css.favoriteIcon} width="16" height="16">
                        <use href="/sprite.svg#icon-bookmark"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className={css.cardActions}>
                <button
                  className={css.buttonPrimary}
                  onClick={() => handleClick(story._id)}
                >
                  Переглянути статтю
                </button>

                <button className={css.buttonIcon}>
                  <svg className={css.buttonIconSvg} width="24" height="24">
                    <use href="/sprite.svg#icon-bookmark"></use>
                  </svg>
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </li>
  );
};

export default TravellersStoriesItem;
