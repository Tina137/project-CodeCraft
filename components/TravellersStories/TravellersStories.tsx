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

const TravellerStories = ({
  items,
  onLoadMore,
  hasMore,
  loadingMore,
}: TravellerStoriesProps) => {
  return (
    <>
      <ul className={css.list}>
        {items.map((story) => (
          <TravellerStoryItem story={story} key={story._id} />
        ))}
      </ul>
      <div className={css.loadMoreWrapper}>
        {onLoadMore && hasMore && (
          <button
            className={css.loadMore}
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Завантаження…" : "Показати ще"}
          </button>
        )}
      </div>
    </>
  );
};

export default TravellerStories;
