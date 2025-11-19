"use client";

import TravellerStoryItem from "../TravellersStoriesItem/TravellersStoriesItem";
import css from "./TravellersStories.module.css";
import { Story } from "@/types/story";

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
  return (
    <>
      <ul className={css.list}>
        {items.map((story) => (
          <TravellerStoryItem key={story._id} story={story} />
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
