"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import type { PaginatedStoriesResponse, Story } from "@/types/story";
import { useStoriesPerPage } from "@/hooks/useStoriesPerPage";

import { clientFetchStoriesPage } from "@/lib/api/clientApi";

type Props = {
  travellerId: string;
  initialStories: PaginatedStoriesResponse;
};

export default function TravellerStoriesWrapper({
  travellerId,
  initialStories,
}: Props) {
  const uiPerPage = useStoriesPerPage();

  const query = useInfiniteQuery({
    queryKey: ["traveller-stories", travellerId, uiPerPage],
    queryFn: ({ pageParam = 1 }) =>
      clientFetchStoriesPage(travellerId, pageParam, uiPerPage),
    initialPageParam: 1,
    initialData: {
      pages: [initialStories],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  const allStories: Story[] = useMemo(
    () => query.data.pages.flatMap((p) => p.data),
    [query.data.pages]
  );

  return (
    <TravellersStories
      items={allStories}
      hasMore={query.hasNextPage}
      loadingMore={query.isFetchingNextPage}
      onLoadMore={() => query.fetchNextPage()}
    />
  );
}
