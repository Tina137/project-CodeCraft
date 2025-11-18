"use client";

import TravellerStoryItem from "../TravellersStoriesItem/TravellersStoriesItem";
import css from "./TravellersStories.module.css";
import { Story } from "@/types/story";
import { useSavedStore } from "@/lib/store/savedStore";

interface TravellerStoriesProps {
  items: Story[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export default function TravellersStories({
  items,
  onLoadMore,
  hasMore,
  loadingMore,
}: TravellerStoriesProps) {
  const savedList = useSavedStore((s) => s.savedList);
  console.log(items);

  return (
    <>
      <ul className={css.list}>
        {items.map((story) => (
          <TravellerStoryItem
            key={story._id}
            story={story}
            isSaved={savedList.includes(story._id)}
          />
        ))}
      </ul>

      <div className={css.loadMoreWrapper}>
        {onLoadMore && hasMore && (
          <button
            className={css.loadMore}
            disabled={loadingMore}
            onClick={onLoadMore}
          >
            {loadingMore ? "Завантаження…" : "Показати ще"}
          </button>
        )}
      </div>
    </>
  );
}
