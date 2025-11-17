import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import conCss from "@/app/container.module.css";
import css from "@/app/travellers/[travellerId]/TravellerId.module.css";

import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import MessageNoStories from "@/components/MessageNoStories/MessageNoStories";
import TravellerStoriesWrapper from "@/app/travellers/[travellerId]/TravellerClient";

import type { User } from "@/types/user";
import type { PaginatedStoriesResponse } from "@/types/story";

type PageProps = { params: Promise<{ travellerId: string }> };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function fetchUser(travellerId: string): Promise<User> {
  const res = await fetch(`${APP_URL}/api/users/${travellerId}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load user: ${res.status}`);

  const json = await res.json();
  return json.data as User;
}

async function fetchFirstStoriesPage(
  travellerId: string,
  perPage: number = 6
): Promise<PaginatedStoriesResponse> {
  const res = await fetch(
    `${APP_URL}/api/stories?ownerId=${travellerId}&page=1&perPage=${perPage}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Failed to load stories: ${res.status}`);
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { travellerId } = await params;
  let user: User | null = null;

  try {
    user = await fetchUser(travellerId);
  } catch {
    notFound();
  }

  const name = user.name ?? "Мандрівник";
  const desc =
    user.description ??
    "Публічний профіль мандрівника та його історії подорожей.";
  const url = `/travellers/${encodeURIComponent(travellerId)}`;
  const image = user.avatarUrl || "";

  return {
    title: `${name} | Подорожники`,
    description: desc,
    openGraph: {
      title: `${name} | Подорожники`,
      description: desc,
      url,
      type: "profile",
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: `${name} profile` }]
        : [],
    },
  };
}

export default async function TravellerPage({ params }: PageProps) {
  const { travellerId } = await params;

  if (!travellerId) notFound();

  const [user, initialStories] = await Promise.all([
    fetchUser(travellerId),
    fetchFirstStoriesPage(travellerId, 6),
  ]);

  const hasStories = initialStories.totalItems > 0;

  const queryClient = new QueryClient();

  if (hasStories) {
    queryClient.setQueryData(
      ["traveller-stories", travellerId, initialStories.perPage],
      {
        pages: [initialStories],
        pageParams: [1],
      }
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={conCss.container}>
      <div className={css.section} aria-label="traveller info">
        <div data-wrapper>
          <TravellerInfo
            name={user.name}
            description={user.description}
            avatarUrl={user.avatarUrl || "/Placeholder_Avatar_Image.png"}
            articlesAmount={initialStories.totalItems}
          />
        </div>
      </div>

      <div aria-label="traveller stories">
        <div data-wrapper>
          <h2 className={css.title}>Історії Мандрівника</h2>

          {hasStories ? (
            <HydrationBoundary state={dehydratedState}>
              <TravellerStoriesWrapper
                travellerId={travellerId}
                initialStories={initialStories}
              />
            </HydrationBoundary>
          ) : (
            <MessageNoStories
              text="Цей користувач ще не публікував історій"
              buttonText="Назад до історій"
              route="/stories"
            />
          )}
        </div>
      </div>
    </div>
  );
}
