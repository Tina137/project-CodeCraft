"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import type { PaginatedStoriesResponse, Story } from "@/types/story";
import { useStoriesPerPage } from "@/hooks/useStoriesPerPage";

type Props = {
  travellerId: string;
  initialStories: PaginatedStoriesResponse;
};

const APP_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function fetchStoriesPage(
  travellerId: string,
  page: number,
  perPage: number
): Promise<PaginatedStoriesResponse> {
  const res = await fetch(
    `${APP_URL}/api/stories?ownerId=${travellerId}&page=${page}&perPage=${perPage}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error(`Failed to load page ${page}`);
  const json = await res.json();

  return {
    page: json.data.page,
    perPage: json.data.perPage,
    totalPages: json.data.totalPages,
    totalItems: json.data.totalItems,
    hasNextPage: json.data.hasNextPage,
    hasPreviousPage: json.data.hasPreviousPage,
    data: json.data.data,
  };
}

export default function TravellerStoriesWrapper({
  travellerId,
  initialStories,
}: Props) {
  const apiPerPage = initialStories.perPage;
  const uiPerPage = useStoriesPerPage();

  const query = useInfiniteQuery({
    queryKey: ["traveller-stories", travellerId, uiPerPage],
    queryFn: ({ pageParam = 1 }) =>
      fetchStoriesPage(travellerId, pageParam, uiPerPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialData: {
      pages: [initialStories],
      pageParams: [1],
    },
  });

  const allStories: Story[] = useMemo(
    () => query.data.pages.flatMap((p) => p.data),
    [query.data.pages]
  );

  const visibleStories = allStories;

  const hasMore = query.hasNextPage === true;

  const handleLoadMore = () => {
    if (hasMore && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  return (
    <TravellersStories
      items={visibleStories}
      hasMore={hasMore}
      loadingMore={query.isFetchingNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}
