import { api } from "./api";
import { User } from "@/types/user";

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

export const setupSession = async (): Promise<boolean> => {
  try {
    await api.post("/auth/refresh");
    return true;
  } catch {
    return false;
  }
};

export const sendResetEmail = async (email: string) => {
  const res = await api.post("/auth/send-reset-email", { email });
  return res.data;
};

export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};

// ---------------- USER ----------------

export const getMe = async () => {
  const { data } = await api.get(`/users/current`);
  return data;
};

// для сторінки profile👇, прошу не змінювати код без попередження

export const getSavedStories = async () => {
  const { data: user } = await api.get("/users/current");

  const savedIds = user.savedStories || [];

  if (savedIds.length === 0) return [];

  const requests = savedIds.map((id: string) => api.get(`/stories/${id}`));
  const responses = await Promise.all(requests);

  return responses.map(res => res.data);
};

export const getMyStories = async () => {
  const { data: user } = await api.get("/users/current");

  const { data: stories } = await api.get("/stories");

  return stories.filter((story: any) => story.author._id === user._id);
};

export const getAllUsers = async () => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
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
  const { data } = await api.post("/users/saved/${storyId}");
  return data;
};

export const removeSavedStory = async (storyId: string) => {
  const { data } = await api.delete("/users/saved/${storyId}");
  return data;
};

// ---------------- STORIES ----------------

export const getStories = async () => {
  const { data } = await api.get("/stories");
  return data;
};

export const getStoryById = async (id: string) => {
  const { data } = await api.get(`/stories/${id}`);
  return data;
};

export const createStory = async (payload: any) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  const { data } = await api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const updateStory = async (id: string, payload: any) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  const { data } = await api.patch(`/stories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const deleteStory = async (id: string) => {
  const { data } = await api.delete(`/stories/${id}`);
  return data;
};
