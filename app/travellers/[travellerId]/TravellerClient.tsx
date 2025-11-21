"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import { useStoriesPerPage } from "@/hooks/useStoriesPerPage";
import { clientFetchStoriesPage } from "@/lib/api/clientApi";
import type { PaginatedStoriesResponse, Story } from "@/types/story";
import Loader from "@/components/Loader/Loader";

type Props = {
  travellerId: string;
  initialStories: PaginatedStoriesResponse;
};

export default function TravellerStoriesWrapper({
  travellerId,
  initialStories,
}: Props) {
  const uiPerPage = useStoriesPerPage();

  const normalizedInitial: PaginatedStoriesResponse = {
    ...initialStories,
    data: initialStories.data ?? initialStories.data ?? [],
  };

  const query = useInfiniteQuery({
    queryKey: ["traveller-stories", travellerId, uiPerPage],
    queryFn: ({ pageParam = 1 }) =>
      clientFetchStoriesPage(travellerId, pageParam, uiPerPage),

    initialPageParam: 1,
    initialData: {
      pages: [normalizedInitial],
      pageParams: [1],
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  const allStories: Story[] = useMemo(
    () =>
      query.data?.pages.flatMap((p) =>
        Array.isArray(p.data) ? p.data : (p.data ?? [])
      ) ?? [],
    [query.data]
  );

  return (
    <>
      {query.isFetching && <Loader />}

      <TravellersStories
        items={allStories}
        hasMore={query.hasNextPage}
        loadingMore={query.isFetchingNextPage}
        onLoadMore={() => query.fetchNextPage()}
      />
    </>
  );
}
