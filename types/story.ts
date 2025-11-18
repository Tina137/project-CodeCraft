import { Category } from "./category";

export interface StoryOwner {
  _id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: StoryOwner;
  favoriteCount: number;
  date: string;
}

export interface StoryFormValues {
  img: File | null;
  title: string;
  article: string;
  category: string;
}

export interface StoryInitialData {
  _id?: string;
  img: string;
  title: string;
  article: string;
  category: string | Category;
}
