import { nextServer } from "./api";
import { User } from "@/types/user";

export type CheckSessionResponse = {
  success: boolean;
};

export const register = async (data: User) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: User) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const checkSession = async () => {
  const { data } = await nextServer.get<CheckSessionResponse>(`/auth/session`);
  return data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get(`/users/me`);
  return data;
};

// export async function getCurrentUser() {
//   const res = await nextServer.get("/users/me");
//   return res.data;
// }

export const getSavedStories = async() => {
  const { data } = await nextServer.get("/stories?type=saved");
  return data;
}

export const  getMyStories = async() => {
  const { data } = await nextServer.get("stories?type=mine");
  return data;
}
