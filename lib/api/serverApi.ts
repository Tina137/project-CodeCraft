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
