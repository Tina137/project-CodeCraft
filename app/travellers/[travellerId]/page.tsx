import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import conCss from "@/app/container.module.css";
import css from "./TravellerId.module.css";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import MessageNoStories from "@/components/MessageNoStories/MessageNoStories";
import TravellerStoriesWrapper from "./TravellerClient";
import { serverFetchUser, serverFetchStoriesPage } from "@/lib/api/serverApi";
import type { User } from "@/types/user";
import { cookies } from "next/headers";

type PageProps = { params: Promise<{ travellerId: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { travellerId } = await params;
  let user: User | null = null;

  try {
    user = await serverFetchUser(travellerId);
  } catch {
    notFound();
  }

  return {
    title: `${user.name} | Подорожники`,
    description:
      user.description ??
      "Публічний профіль мандрівника та його історії подорожей.",
  };
}

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const cookieHeader = [
      accessToken ? `accessToken=${accessToken}` : "",
      refreshToken ? `refreshToken=${refreshToken}` : "",
      sessionId ? `sessionId=${sessionId}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/current`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function TravellerPage({ params }: PageProps) {
  const { travellerId } = await params;
  if (!travellerId) notFound();

  const currentUser = await getCurrentUser();
  const savedList = currentUser?.savedStories ?? [];

  const [user, initialStories] = await Promise.all([
    serverFetchUser(travellerId),
    serverFetchStoriesPage(travellerId, 1, 6),
  ]);

  const queryClient = new QueryClient();

  queryClient.setQueryData(
    ["traveller-stories", travellerId, initialStories.perPage],
    { pages: [initialStories], pageParams: [1] }
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={conCss.container}>
      <div className={css.section}>
        <TravellerInfo
          _id={user._id}
          name={user.name}
          description={user.description}
          avatarUrl={user.avatarUrl || "/Placeholder_Avatar_Image.png"}
          articlesAmount={initialStories.totalItems}
          showViewProfileButton={false}
        />
      </div>

      <div>
        <h2 className={css.title}>Історії Мандрівника</h2>

        {initialStories.totalItems > 0 ? (
          <HydrationBoundary state={dehydratedState}>
            <TravellerStoriesWrapper
              travellerId={travellerId}
              initialStories={initialStories}
              savedList={savedList}
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
  );
}
