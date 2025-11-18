import { notFound } from "next/navigation";
import type { User } from "@/types/user";
import type { PaginatedStoriesResponse } from "@/types/story";

export async function serverApi(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL;

  return fetch(base + path, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

export async function serverGetMe() {
  const res = await serverApi("/users/current", { method: "GET" });
  return res.json();
}

export async function getUsersServer(page: number, limit: number) {
  const path = `/api/users?page=${page}&limit=${limit}`;
  const res = await serverApi(path, { method: "GET" });
  return res.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function serverFetchUser(travellerId: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/users/${travellerId}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load user: ${res.status}`);

  const json = await res.json();
  return json.data as User;
}

export async function serverFetchStoriesPage(
  travellerId: string,
  page = 1,
  perPage = 6
): Promise<PaginatedStoriesResponse> {
  const res = await fetch(
    `${API_URL}/api/stories?ownerId=${travellerId}&page=${page}&perPage=${perPage}`,
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
    data: json.data.stories,
  };
}
