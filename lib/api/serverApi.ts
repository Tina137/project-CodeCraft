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
