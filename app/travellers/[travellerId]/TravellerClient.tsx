"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import { useStoriesPerPage } from "@/hooks/useStoriesPerPage";
import { clientFetchStoriesPage } from "@/lib/api/clientApi";
import { useSavedStore } from "@/lib/store/savedStore";
import { getMe } from "@/lib/api/clientApi"; //
import type { PaginatedStoriesResponse, Story } from "@/types/story";

type Props = {
  travellerId: string;
  initialStories: PaginatedStoriesResponse;
};

export default function TravellerStoriesWrapper({
  travellerId,
  initialStories,
}: Props) {
  const uiPerPage = useStoriesPerPage();

  const setSavedList = useSavedStore((s) => s.setSavedList);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const me = await getMe();

        setSavedList(me.data.savedStories ?? []);
      } catch (e) {
        console.error("Failed to fetch current user", e);
      }
    };

    fetchSaved();
  }, [setSavedList]);

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
    () => query.data!.pages.flatMap((p) => p.data),
    [query.data]
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
