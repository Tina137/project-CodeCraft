import { api } from "./api";
import { User } from "@/types/user";
import { Category } from "@/types/category";

export type CheckSessionResponse = {
  success: boolean;
};

// ---------------- AUTH ----------------

export const register = async (data: User) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: User) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const setupSession = async () => {
  const { data } = await api.post<CheckSessionResponse>(`/auth/refresh`);
  return data.success;
};

// ---------------- USER ----------------

export const getMe = async () => {
  const { data } = await api.get<User>(`/users/current`);
  return data;
};

export const updateProfile = async (payload: any) => {
  const { data } = await api.patch("/users/updateUser", payload);
  return data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

// Saved stories

export const saveStory = async (storyId: string) => {
  const { data } = await api.post(`/users/saved/${storyId}`);
  return data;
};

export const removeSavedStory = async (storyId: string) => {
  const { data } = await api.delete(`/users/saved/${storyId}`);
  return data;
};

// ---------------- STORIES ----------------

export const getStories = async () => {
  const { data } = await api.get("/stories");
  return data.data ?? data;
};

export const getStoryById = async (id: string) => {
  const { data } = await api.get(`/stories/${id}`);
  return data.data ?? data;
};

export const createStory = async (payload: any) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  const { data } = await api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data ?? data;
};

export const updateStory = async (id: string, payload: any) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  const { data } = await api.patch(`/stories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data ?? data;
};

export const deleteStory = async (id: string) => {
  const { data } = await api.delete(`/stories/${id}`);
  return data.data ?? data;
};

// ---------------- CATEGORIES ----------------

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.data ?? data;
};
