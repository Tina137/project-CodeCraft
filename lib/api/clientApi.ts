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
  const { data } = await nextServer.get<User>(`/users/me`);
  return data;
};